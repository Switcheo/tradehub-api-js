import * as ethSignUtils from 'eth-sig-util'
import RegistryContract from './registry_contract'
import { ethers } from 'ethers'
import { Network } from '../../types'
import { NETWORK } from '../../config'

const CONTRACT_HASH = {
  // use same ropsten contract for all non-mainnet uses
  [Network.TestNet]: '0x23629C94F4e8b719094f5D1Ae1c1AA8d6d687966',
  [Network.DevNet]: '0x23629C94F4e8b719094f5D1Ae1c1AA8d6d687966',
  [Network.LocalHost]: '0x23629C94F4e8b719094f5D1Ae1c1AA8d6d687966',

  [Network.MainNet]: '0x41500944FE7401a202C3344548eD8Dc668DE46e8',
}

const ETH_CHAIN_NAMES = {
  1: 'MainNet',
  3: 'Ropsten',
} as const

const ENCRYPTION_VERSION = 'x25519-xsalsa20-poly1305'

const MNEMONIC_MATCH_REGEX = /-----BEGIN MNEMONIC PHRASE-----([a-z\s]*)-----END MNEMONIC PHRASE-----/mi
const MNEMONIC_MATCH_REGEX_LEGACY = /^[a-z\s]*$/i

const getRequiredEthChain = (network: Network) => {
  if (network === Network.MainNet) {
    return 1
  }

  return 3
}

const getEncryptMessage = (input: string) => {
  return `
  !!! Attention !!! Please make sure you are connecting to https://app.dem.exchange, do not confirm decrypt if you're connecting to untrusted sites.
  -----BEGIN MNEMONIC PHRASE-----
  ${input}
  -----END MNEMONIC PHRASE-----
  `.trim().replaceAll(/^\s+/gm, '')
}

interface RequestArguments {
  method: string
  params?: unknown[] | object
}

interface MetaMaskAPI {
  isConnected: () => boolean
  request: (args: RequestArguments) => Promise<unknown>
}

export interface CallContractArgs {
  from?: string
  value?: string
  data?: string
}

/**
 * TODO: Add docs
 */
export class MetaMask {
  private metamaskAPI: MetaMaskAPI | null = null

  public readonly provider: ethers.providers.Provider | null = null

  constructor(
    public readonly network: Network,
  ) {
    const providerUrl = NETWORK[network].ETH_URL
    if (providerUrl) {
      this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
    }
  }

  private checkProvider(): ethers.providers.Provider {
    if (!this.provider) {
      throw new Error(`MetaMask login not supported for this network ${this.network}`)
    }

    return this.provider
  }

  async getConnectedAPI(): Promise<MetaMaskAPI> {
    if (this.metamaskAPI && this.metamaskAPI.isConnected()) {
      return this.metamaskAPI
    }

    const metamaskAPI = (window as any).ethereum as MetaMaskAPI

    if (metamaskAPI === undefined) {
      throw new Error('MetaMask not connected, please check that your extension is enabled')
    }

    if (metamaskAPI.isConnected()) {
      return metamaskAPI
    }

    await metamaskAPI.request({ method: 'eth_requestAccounts' })

    this.metamaskAPI = metamaskAPI
    return this.metamaskAPI
  }

  async connect() {
    return this.getConnectedAPI()
  }

  async defaultAccount() {
    const metamaskAPI = await this.getConnectedAPI()
    const [defaultAccount] = await metamaskAPI.request({ method: 'eth_requestAccounts' }) as string[]

    if (!defaultAccount) {
      throw new Error('No default account on MetaMask, please create one first')
    }

    return defaultAccount
  }

  async getStoredMnemonicCipher(account: string): Promise<string | undefined> {
    const contractHash = this.getContractHash()
    const provider = this.checkProvider()
    const contract = new ethers.Contract(contractHash, RegistryContract.abi, provider)
    const cipherTextHex: string | undefined = await contract.map(account)
    if (!cipherTextHex?.length || cipherTextHex === '0x') {
      // value would be '0x' if not initialized
      return undefined
    }
    return cipherTextHex
  }

  async encryptMnemonic(mnemonic: string): Promise<string> {
    const metamaskAPI = await this.getConnectedAPI()
    const defaultAccount = await this.defaultAccount()
    const publicKey = await metamaskAPI.request({
      method: 'eth_getEncryptionPublicKey',
      params: [defaultAccount],
    }) as string

    const messageToEncrypt = getEncryptMessage(mnemonic);

    const cipher = ethSignUtils.encrypt(publicKey, {
      data: messageToEncrypt,
    }, ENCRYPTION_VERSION)

    const {
      version,
      nonce,
      ephemPublicKey,
      ciphertext,
    } = cipher
    const encryptedMnemonic = ethers.utils.toUtf8Bytes([
      version,
      nonce,
      ephemPublicKey,
      ciphertext,
    ].join('.'))

    return Buffer.from(encryptedMnemonic).toString('hex')
  }

  async storeMnemonic(encryptedMnemonic: string) {
    const metamaskAPI = await this.getConnectedAPI()
    const defaultAccount = await this.defaultAccount()
    const storedMnemonicCipher = await this.getStoredMnemonicCipher(defaultAccount)

    if (storedMnemonicCipher) {
      throw new Error('Cannot store key on registry - key already exists for ETH account')
    }

    const contractHash = this.getContractHash()
    const provider = this.checkProvider()
    const contract = new ethers.Contract(contractHash, RegistryContract.abi, provider)

    const dataBytes = Buffer.from(encryptedMnemonic, 'hex')
    const unsignedTx = await contract.populateTransaction.Store(dataBytes)

    const txHash = await metamaskAPI.request({
      method: 'eth_sendTransaction',
      params: [{
        ...unsignedTx,
        from: defaultAccount,
      }],
    })

    return txHash
  }

  async login(): Promise<string | null> {
    const metamaskAPI = await this.getConnectedAPI()
    const defaultAccount = await this.defaultAccount()
    const cipherTextHex: string | undefined = await this.getStoredMnemonicCipher(defaultAccount)

    const chainIdHex = await metamaskAPI.request({ method: 'eth_chainId' }) as string
    const chainId = parseInt(chainIdHex, 16)

    const requiredChainId = getRequiredEthChain(this.network)
    if (chainId !== requiredChainId) {
      const requiredNetworkName = ETH_CHAIN_NAMES[requiredChainId] || ETH_CHAIN_NAMES[3]
      throw new Error(`MetaMask not connected to correct network, please use ${requiredNetworkName}`)
    }

    if (!cipherTextHex || !cipherTextHex.length) {
      return null
    }

    const cipherText = ethers.utils.toUtf8String(cipherTextHex)
    const [version, nonce, ephemPublicKey, ciphertext] = cipherText.split('.')

    const cipher = {
      version,
      nonce,
      ephemPublicKey,
      ciphertext,
    }

    const decryptedCipherText = (await metamaskAPI.request({
      method: 'eth_decrypt',
      params: [JSON.stringify(cipher), defaultAccount],
    }) as string)?.trim()

    // legacy encrypted mnemonic doesnt include warning message.
    if (decryptedCipherText.match(MNEMONIC_MATCH_REGEX_LEGACY)) {
      return decryptedCipherText
    }

    // match line with prefix 'mnemonic: '
    const match = decryptedCipherText.match(MNEMONIC_MATCH_REGEX)

    // invalid cipher
    if (!match) {
      console.error('invalid account info retrieved from contract')
      console.error(decryptedCipherText)
      throw new Error('Retrieved invalid account on blockchain, please check console for more information.')
    }

    return match[1]?.trim()
  }

  private getContractHash() {
    const contractHash = CONTRACT_HASH[this.network]
    if (!contractHash) {
      throw new Error(`MetaMask login is not supported on ${this.network}`)
    }

    return contractHash
  }
}

export default MetaMask
