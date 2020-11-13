import * as ethSignUtils from 'eth-sig-util'
import RegistryContract from './registry_contract'
import { ethers } from 'ethers'
import { Network } from '../../types'
import { NETWORK } from '../../config'

const CONTRACT_HASH = {
  // use same ropsten contract for all non-mainnet uses
  [Network.TestNet]: '0x50dA4013276bcC645c67DFaBaeC9221cB87d51b0',
  [Network.DevNet]: '0x50dA4013276bcC645c67DFaBaeC9221cB87d51b0',
  [Network.LocalHost]: '0x50dA4013276bcC645c67DFaBaeC9221cB87d51b0',
  [Network.MainNet]: '0x9E1b7a4AAF8f7Ad0390bADBa72E2a614E7a1f83B',
}

const ETH_CHAIN_NAMES = {
  1: 'MainNet',
  3: 'Ropsten',
} as const

const ENCRYPTION_VERSION = 'x25519-xsalsa20-poly1305'

const getRequiredEthChain = (network: Network) => {
  if (network === Network.MainNet) {
    return 1
  }

  return 3
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
    if (!cipherTextHex || !cipherTextHex.length) {
      // value would be '' if not initialized
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


    const cipher = ethSignUtils.encrypt(publicKey, {
      data: mnemonic,
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

    const unsignedTx = await contract.populateTransaction.Store(encryptedMnemonic)

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
      const requiredNetworkName = ETH_CHAIN_NAMES[requiredChainId] || ETH_CHAIN_NAMES['0x3']
      throw new Error(`MetaMask not connected to correct network, please use ${requiredNetworkName}`)
    }

    if (!cipherTextHex || !cipherTextHex.length) {
      return null
    }

    const cipherText = ethers.utils.toUtf8String(Buffer.from(cipherTextHex, 'hex'))
    const [version, nonce, ephemPublicKey, ciphertext] = cipherText.split('.')

    const cipher = {
      version,
      nonce,
      ephemPublicKey,
      ciphertext,
    }

    const privateKey = await metamaskAPI.request({
      method: 'eth_decrypt',
      params: [JSON.stringify(cipher), defaultAccount],
    }) as string

    return privateKey
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
