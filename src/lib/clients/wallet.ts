import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import { BigNumber } from 'bignumber.js'
import Dagger from '@maticnetwork/eth-dagger'
import { ethers } from 'ethers'
import { CONFIG, getBech32Prefix, getNetwork, Network } from '../config'
import { StdSignDoc, Transaction } from '../containers'
import { marshalJSON, sortAndStringifyJSON } from '../utils/encoder'
import { Address, getPath, PrivKeySecp256k1, PubKeySecp256k1 } from '../utils/wallet'
import { ConcreteMsg } from '../containers/Transaction'
import { HDWallet } from '../utils/hdwallet'
import BALANCE_READER_ABI from '../eth/abis/balanceReader.json'
import LOCK_PROXY_ABI from '../eth/abis/lockProxy.json'
import ERC20_ABI from '../eth/abis/erc20.json'
import { Blockchain } from '../constants'
import Neon, { api, u } from '@cityofzion/neon-js'
import stripHexPrefix from 'strip-hex-prefix'
import CosmosLedger from '@lunie/cosmos-ledger'
import {
  wallet as neonWallet,
  rpc as neonRPC,
  sc as neonScript,
  u as neonUtils
} from '@cityofzion/neon-core'
import { chunk } from 'lodash'
import { FeeResult } from '../models'
import { TokenList, TokenObject } from '../models/balances/NeoBalances'
import { Fee, Network as NETWORK } from '../types'
import { logger } from '../utils'
import fetch from '../utils/fetch'
import { NEOClient } from './neo'

export type SignerType = 'ledger' | 'mnemonic' | 'privateKey' | 'nosign'
export type OnRequestSignCallback = (signDoc: StdSignDoc) => void
export type OnSignCompleteCallback = (signature: string) => void

const SEQ_NUM_ERROR = 'unauthorized: signature verification failed; verify correct account sequence and chain-id'

export interface GasFees {
  [msgType: string]: string,
}

export interface WalletConstructorParams {
  accountNumber?: string
  network: Network
  useSequenceCounter?: boolean // default true
  broadcastQueueIntervalTime?: number // default 100 (ms)
  pubKey?: Array<Number>
  pubKeyBech32?: string
  mnemonic?: string
  privateKey?: string
  gas?: string // default CONFIG.default_gas
  signerType?: SignerType // default privateKey
  ledger?: CosmosLedger
  fees?: GasFees
  onRequestSign?: OnRequestSignCallback
  onSignComplete?: OnSignCompleteCallback
}

export interface InitParams {
  accountNumber?: string
  fees?: GasFees
}

interface ETHTxParams {
  gasPriceGwei: BigNumber
  gasLimit: BigNumber
  ethAddress: string
  signer: ethers.Signer
}

export interface LockEthParams extends ETHTxParams {
  amount: BigNumber
  token: TokenObject
  signCompleteCallback?: () => void
}
export interface ApproveERC20Params extends ETHTxParams {
  token: TokenObject
  signCompleteCallback?: () => void
}

export interface BroadcastQueueItem {
  id: string,
  concreteMsgs: ConcreteMsg[],
  options: any
}

export interface BroadcastResults {
  [id: string]: any
}

interface ScriptResult {
  stack: ReadonlyArray<{ type: string, value: string }>
}

/**
 * @deprecated 
 * use TradeHubSDK.wallet
 */
export class WalletClient {
  public static async connectMnemonic(mnemonic: string, net?: string) {
    const network = getNetwork(net)
    return new WalletClient({
      mnemonic,
      network,
      signerType: 'mnemonic',
    })
  }

  public static async connectPrivateKey(privateKey: string, net?: string) {
    const network = getNetwork(net)
    return new WalletClient({
      privateKey,
      network,
      signerType: 'privateKey',
    })
  }

  public static async connectLedger(cosmosLedger: CosmosLedger, net = 'TESTNET',
    onRequestSign: OnRequestSignCallback,
    onSignComplete: OnSignCompleteCallback) {
    const network = getNetwork(net)
    const pubKeyBech32 = await cosmosLedger.getCosmosAddress()
    const pubKey = await cosmosLedger.getPubKey()

    return new WalletClient({
      ledger: cosmosLedger,
      network,
      pubKey,
      pubKeyBech32,
      signerType: 'ledger',
      onRequestSign,
      onSignComplete,
    })
  }

  // for debug view
  public static async connectPublicKey(pubKeyBech32: string, net?: string) {
    const network = getNetwork(net)
    return new WalletClient({
      network,
      pubKeyBech32,
      signerType: 'nosign',
    })
  }

  public readonly mnemonic?: string
  public readonly hdWallet: HDWallet
  public readonly privKey: PrivKeySecp256k1
  public readonly address: Uint8Array
  public readonly addressHex: string
  public readonly ethAddress?: string
  public readonly pubKeySecp256k1: PubKeySecp256k1
  public readonly pubKeyBase64: string
  public readonly pubKeyBech32: string
  public readonly validatorBech32: string
  public readonly consensusBech32: string
  public readonly gas: string
  public readonly signerType: SignerType
  public readonly ledger?: CosmosLedger
  public readonly network: Network
  public readonly feeMultiplier: ethers.BigNumber // feeAmount * feeMultiplier = min deposit / withdrawal amount
  public fees: GasFees
  public accountNumber: string
  public broadcastMode: string
  public depositAddresses: { [key: string]: string }
  public onRequestSign?: OnRequestSignCallback
  public onSignComplete?: OnSignCompleteCallback

  private useSequenceCounter: boolean
  private sequenceCounter?: number
  private broadcastQueueIntervalTime: number
  private broadcastQueueIntervalId: number
  private broadcastQueue: BroadcastQueueItem[]
  private broadcastResults: BroadcastResults
  private isBroadcastQueuePaused: boolean
  private neoDepositsIntervalId: number

  constructor(params: WalletConstructorParams) {
    const {
      mnemonic,
      pubKeyBech32,
      pubKey,
      accountNumber,
      network,
      broadcastQueueIntervalTime = 100,
      useSequenceCounter = true,
      privateKey,
      signerType,
      ledger,
      gas = CONFIG.DEFAULT_GAS,
      onRequestSign,
      onSignComplete,
      fees,
    } = params
    if (!mnemonic && signerType === 'mnemonic') {
      throw new Error('Signer Type is mnemonic but mnemonic is not passed in')
    }
    if (!privateKey && signerType === 'privateKey') {
      throw new Error('Signer Type is privateKey but privateKey is not passed in')
    }
    let address
    if (mnemonic) {
      const privateKey = getPrivKeyFromMnemonic(mnemonic)
      const privKey = new PrivKeySecp256k1(Buffer.from(privateKey, 'hex'))
      this.mnemonic = mnemonic
      this.hdWallet = HDWallet.getWallet(mnemonic)
      this.privKey = privKey
      this.ethAddress = new ethers.Wallet('0x' + this.hdWallet[Blockchain.Ethereum]).address

      this.pubKeySecp256k1 = this.privKey.toPubKey()
      address = this.pubKeySecp256k1.toAddress()
      this.pubKeyBase64 = this.pubKeySecp256k1.pubKey.toString('base64')
    } else if (privateKey) {
      this.privKey = new PrivKeySecp256k1(Buffer.from(privateKey, 'hex'))
      this.pubKeySecp256k1 = this.privKey.toPubKey()
      address = this.pubKeySecp256k1.toAddress()
      this.pubKeyBase64 = this.pubKeySecp256k1.pubKey.toString('base64')
    } else if (signerType === 'nosign') {
      address = Address.fromBech32(getBech32Prefix(network, 'main'), pubKeyBech32)
    } else {
      this.pubKeySecp256k1 = new PubKeySecp256k1(Buffer.from(pubKey as number[]))
      this.pubKeyBase64 = this.pubKeySecp256k1.pubKey.toString('base64')
      address = Address.fromBech32(getBech32Prefix(network, 'main'), pubKeyBech32)
    }
    this.fees = fees
    this.address = address.toBytes()
    this.addressHex = stripHexPrefix(ethers.utils.hexlify(this.address))
    this.pubKeyBech32 = address.toBech32(getBech32Prefix(network, 'main'))
    this.validatorBech32 = address.toBech32(getBech32Prefix(network, 'validator'))
    this.consensusBech32 = address.toBech32(getBech32Prefix(network, 'consensus'))

    this.signerType = signerType
    this.gas = gas
    this.accountNumber = accountNumber
    this.network = network
    this.depositAddresses = {}
    this.ledger = ledger
    this.onRequestSign = onRequestSign
    this.onSignComplete = onSignComplete
    this.feeMultiplier = ethers.BigNumber.from(2)

    this.useSequenceCounter = useSequenceCounter
    this.broadcastQueueIntervalTime = broadcastQueueIntervalTime
    this.broadcastQueue = []
    this.broadcastResults = {}

    this.broadcastQueueIntervalId = <any>setInterval(() => {
      this.processBroadcastQueue()
    }, this.broadcastQueueIntervalTime)
  }

  public setBroadcastQueueIntervalTime(newInterval: number) {
    clearInterval(this.broadcastQueueIntervalId)
    this.broadcastQueueIntervalTime = newInterval
    this.broadcastQueueIntervalId = <any>setInterval(() => {
      this.processBroadcastQueue()
    }, this.broadcastQueueIntervalTime)
  }

  public disconnect() {
    clearInterval(this.broadcastQueueIntervalId)
    clearInterval(this.neoDepositsIntervalId)
  }

  public sign(message) {
    const privKey = this.privKey
    const data = privKey.sign(message)
    const signatureBase64 = Buffer.from(data.signature).toString('base64')
    return {
      pub_key: {
        type: 'tendermint/PubKeySecp256k1',
        value: this.pubKeyBase64,
      },
      signature: signatureBase64,
    }
  }

  public initialize(params: InitParams) {
    if (params.fees) {
      this.fees = params.fees
    }

    if (params.accountNumber) {
      this.accountNumber = params.accountNumber
    }
  }

  public broadcast(body) {
    return fetch(`${this.network.REST_URL}/txs`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => res.json()) // expecting a json response
  }

  public getAccount() {
    return fetch(`${this.network.REST_URL}/auth/accounts/${this.pubKeyBech32}`)
      .then(res => res.json()) // expecting a json response
  }

  public getWalletBalance() {
    return fetch(`${this.network.REST_URL}/get_balance?account=${this.pubKeyBech32}`)
      .then(res => res.json()) // expecting a json response
  }

  public getTransfers() {
    return fetch(`${this.network.REST_URL}/get_external_transfers?account=${this.pubKeyBech32}`)
      .then(res => res.json()) // expecting a json response
  }

  public async watchDepositAddresses(whitelistDenoms?: string[]) {
    this.watchNeoDepositAddress(whitelistDenoms)
    this.watchEthDepositAddress(whitelistDenoms)
  }

  public async watchNeoDepositAddress(whitelistDenoms?: string[]) {
    const address = await this.getDepositAddress(Blockchain.Neo)
    await this.sendNeoDeposits(address, whitelistDenoms)

    // check every 15 seconds
    this.neoDepositsIntervalId = <any>setInterval(() => {
      this.sendNeoDeposits(address, whitelistDenoms)
    }, 15 * 1000)
  }

  public async sendNeoDeposits(address, whitelistDenoms?: string[]) {
    const url = await this.getNeoRpcUrl()

    let tokens = await this.getNeoExternalBalances(address, url, whitelistDenoms)
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (token.external_balance !== undefined && token.external_balance !== '0') {
        const feeAmount = ethers.BigNumber.from('100000000')
        await this.sendNeoDeposit(token, feeAmount)
      }
    }
  }

  public getTargetProxyHash(token) {
    const prefix = getBech32Prefix(this.network, 'main')
    const address = Address.fromBech32(prefix, token.originator)
    const addressBytes = address.toBytes()
    const addressHex = stripHexPrefix(ethers.utils.hexlify(addressBytes))
    return addressHex
  }

  public async getFeeInfo(denom: string) {
    const url = this.network.FEE_URL + '/fees?denom=' + denom
    const result = await fetch(url).then(res => res.json()) as FeeResult
    return result
  }

  public async sendNeoDeposit(token, feeAmountInput, _privateKey = null) {
    const privateKey = !!_privateKey ? _privateKey : this.hdWallet[Blockchain.Neo]
    const account = Neon.create.account(privateKey)

    const scriptHash = u.reverseHex(token.lock_proxy_hash)

    const fromAssetHash = token.asset_id
    const fromAddress = u.reverseHex(account.scriptHash)
    const targetProxyHash = this.getTargetProxyHash(token)
    const toAssetHash = u.str2hexstring(token.denom)
    const toAddress = this.addressHex

    const amount = ethers.BigNumber.from(token.external_balance)
    const feeAmount = ethers.BigNumber.from(feeAmountInput ?? '100000000')
    const feeAddress = this.network.FEE_ADDRESS
    const nonce = Math.floor(Math.random() * 1000000)

    if (amount.lt(feeAmount)) {
      return false
    }

    const sb = Neon.create.scriptBuilder()
    sb.emitAppCall(scriptHash, 'lock', [
      fromAssetHash,
      fromAddress,
      targetProxyHash,
      toAssetHash,
      toAddress,
      amount.toNumber(),
      feeAmount.toNumber(),
      feeAddress,
      nonce
    ])

    const rpcUrl = await this.getNeoRpcUrl()
    const apiProvider = this.network.NAME === 'mainnet' ?
      new api.neonDB.instance('https://api.switcheo.network')
      : new api.neoCli.instance(rpcUrl)
    return Neon.doInvoke({
      api: apiProvider,
      url: rpcUrl,
      account,
      script: sb.str,
      gas: 0,
      fees: 0
    })
  }

  public async wrapNeoToNneo(neoAmount: number, _privateKey = null) {
    const privateKey = !!_privateKey ? _privateKey : this.hdWallet[Blockchain.Neo]
    const rpcUrl = await this.getNeoRpcUrl()
    const account = Neon.create.account(privateKey)
    const network = NETWORK.MainNet

    const neoClient = NEOClient.instance({
      network,
    })
    neoClient.wrapNeoToNneo(neoAmount, account, rpcUrl)
  }

  public async watchEthDepositAddress(whitelistDenoms?: string[]) {
    const address = await this.getDepositAddress(Blockchain.Ethereum)
    // do an initial check
    await this.sendEthDeposits(address, whitelistDenoms)

    const dagger = new Dagger(this.network.ETH_WS_URL)
    // watch for Ethereum transfers
    dagger.on(`latest:addr/${address}/tx/in`, () => {
      this.sendEthDeposits(address, whitelistDenoms)
    })

    // watch for Ethereum token transfers
    const transferKey = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    dagger.on(`latest:log/+/filter/${transferKey}/+/${address}/#`, () => {
      this.sendEthDeposits(address, whitelistDenoms)
    })
  }

  public async sendEthDeposits(address, whitelistDenoms?: string[]) {
    const tokens = await this.getEthExternalBalances(address, whitelistDenoms)
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      const balance = ethers.BigNumber.from(token.external_balance)
      if (!balance.isZero()) {
        // send the deposit in 30 seconds to avoid problems with block re-orgs
        // if the deposit is sent too early, and there is a block re-org then the
        // ethpayer service might check and see that there is no token balance and
        // it would ignore the request
        setTimeout(async () => {
          try {
            await this.sendEthDeposit(token, address)
          } catch (e) {
            console.error('could not send deposit', e)
          }
        }, 30)
      }
    }
  }

  /**
   * @deprecated use ETHClient
   */
  public async isEthContract(address) {
    const provider = this.getEthProvider()
    const code = await provider.getCode(address)
    // non-contract addresses should return 0x
    return code != '0x'
  }

  /**
   * @deprecated use ETHClient
   */
  public async isBscContract(address) {
    const provider = this.getBscProvider()
    const code = await provider.getCode(address)
    // non-contract addresses should return 0x
    return code != '0x'
  }

  public async getDepositFeeAmount(token, depositAddress) {
    const feeInfo = await this.getFeeInfo(token.denom)
    if (!feeInfo.details?.deposit?.fee) {
      throw new Error('unsupported token')
    }

    let feeAmount = ethers.BigNumber.from(feeInfo.details.deposit.fee)
    if (token.blockchain == Blockchain.Ethereum) {
      const walletContractDeployed = await this.isEthContract(depositAddress)
      if (!walletContractDeployed) {
        feeAmount = feeAmount.add(ethers.BigNumber.from(feeInfo.details.createWallet.fee))
      }
    } else if (token.blockchain == Blockchain.BinanceSmartChain) {
      const walletContractDeployed = await this.isBscContract(depositAddress)
      if (!walletContractDeployed) {
        feeAmount = feeAmount.add(ethers.BigNumber.from(feeInfo.details.createWallet.fee))
      }
    }

    return feeAmount
  }

  public async getWithdrawalFeeAmount(token) {
    const feeInfo = await this.getFeeInfo(token.denom)
    if (!feeInfo.details?.withdrawal?.fee) {
      throw new Error('unsupported token')
    }

    return ethers.BigNumber.from(feeInfo.details.withdrawal.fee)
  }

  public async getMinDepositAmount(token, depositAddress) {
    const fee = await this.getDepositFeeAmount(token, depositAddress)
    return fee.mul(this.feeMultiplier)
  }

  public async getMinWithdrawalAmount(token) {
    const fee = await this.getWithdrawalFeeAmount(token)
    return fee.mul(this.feeMultiplier)
  }

  public async ethSign(message: string) {
    const privateKey = this.hdWallet[Blockchain.Ethereum]
    const ethWallet = new ethers.Wallet(`0x${privateKey}`)
    const messageBytes = ethers.utils.arrayify(message)
    const signatureBytes = await ethWallet.signMessage(messageBytes)
    const signature = ethers.utils.hexlify(signatureBytes).replace(/^0x/g, '')
    return {
      address: ethWallet.address,
      signature,
    }
  }

  /**
   * @deprecated use ETHClient
   */
  public async sendEthDeposit(token, depositAddress, getSignatureCallback?: (msg: string) => Promise<{ address: string, signature: string }>) {
    const feeAmount = await this.getDepositFeeAmount(token, depositAddress)
    const amount = ethers.BigNumber.from(token.external_balance)
    if (amount.lt(feeAmount.mul(this.feeMultiplier))) {
      return 'insufficient balance'
    }

    const assetId = '0x' + token.asset_id
    const targetProxyHash = '0x' + this.getTargetProxyHash(token)
    const feeAddress = '0x' + this.network.FEE_ADDRESS
    const toAssetHash = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(token.denom))
    const nonce = Math.floor(Math.random() * 1000000000) // random nonce to prevent replay attacks
    const message = ethers.utils.solidityKeccak256(
      ['string', 'address', 'bytes', 'bytes', 'bytes', 'uint256', 'uint256', 'uint256'],
      ['sendTokens', assetId, targetProxyHash, toAssetHash, feeAddress, amount, feeAmount, nonce]
    )

    let signatureResult: {
      owner: string
      r: string
      s: string
      v: string
    } | undefined

    if (getSignatureCallback) {
      const { address, signature } = await getSignatureCallback(message)
      const signatureBytes = ethers.utils.arrayify('0x' + signature)
      const rsv = ethers.utils.splitSignature(signatureBytes)

      signatureResult = {
        owner: address,
        v: rsv.v.toString(),
        r: rsv.r,
        s: rsv.s,
      }
    } else {
      const messageBytes = ethers.utils.arrayify(message)
      const privateKey = this.hdWallet[Blockchain.Ethereum]
      const etherWallet = new ethers.Wallet('0x' + privateKey)
      const owner = etherWallet.address
      const signature = await etherWallet.signMessage(messageBytes)
      const rsv = ethers.utils.splitSignature(signature)

      signatureResult = {
        owner,
        v: rsv.v.toString(),
        r: rsv.r,
        s: rsv.s,
      }
    }

    const swthAddress = ethers.utils.hexlify(this.address)
    const body = {
      OwnerAddress: signatureResult.owner,
      SwthAddress: swthAddress,
      AssetHash: assetId,
      TargetProxyHash: targetProxyHash,
      ToAssetHash: toAssetHash,
      Amount: amount.toString(),
      FeeAmount: feeAmount.toString(),
      FeeAddress: feeAddress,
      Nonce: nonce.toString(),
      V: signatureResult.v,
      R: signatureResult.r,
      S: signatureResult.s,
    }

    const result = await fetch(
      this.network.ETH_PAYER_URL + '/deposit',
      { method: 'POST', body: JSON.stringify(body) }
    )
    return result
  }

  public async getDepositAddress(blockchain: string) {
    if (this.depositAddresses[blockchain] !== undefined) {
      return this.depositAddresses[blockchain]
    }

    let depositAddress = ''
    if (blockchain === Blockchain.Neo) {
      depositAddress = await this.getNeoDepositAddress()
    } else if (blockchain === Blockchain.Ethereum) {
      depositAddress = await this.getEthDepositAddress()
    } else if (blockchain === Blockchain.BinanceSmartChain) {
      depositAddress = await this.getBscDepositAddress()
    } else {
      return 'unsupported blockchain'
    }

    this.depositAddresses[blockchain] = depositAddress
    return depositAddress
  }

  public getTokens() {
    return fetch(`${this.network.REST_URL}/get_tokens`)
      .then(res => res.json()) // expecting a json response
  }


  public async getNeoDepositAddress() {
    const privateKey = this.hdWallet[Blockchain.Neo]
    const account = Neon.create.account(privateKey)
    return account.address
  }

  /**
   * @deprecated use ETHClient
   */
  public async getEthDepositAddress(ownerEthAddress?: string) {
    const swthAddress = ethers.utils.hexlify(this.address)
    if (!ownerEthAddress) {
      const privateKey = this.hdWallet[Blockchain.Ethereum]
      ownerEthAddress = (new ethers.Wallet('0x' + privateKey)).address
    }

    const provider = this.getEthProvider()
    const contractAddress = this.network.ETH_LOCKPROXY
    const contract = new ethers.Contract(contractAddress, LOCK_PROXY_ABI, provider)
    const walletAddress = await contract.getWalletAddress(ownerEthAddress, swthAddress, this.network.ETH_WALLET_BYTECODE_HASH)

    return walletAddress
  }

  /**
   * @deprecated use ETHClient
   */
  public async getBscDepositAddress(ownerEthAddress?: string) {
    const swthAddress = ethers.utils.hexlify(this.address)
    if (!ownerEthAddress) {
      const privateKey = this.hdWallet[Blockchain.Ethereum]
      ownerEthAddress = (new ethers.Wallet('0x' + privateKey)).address
    }

    const provider = this.getBscProvider()
    const contractAddress = this.network.BSC_LOCKPROXY
    const contract = new ethers.Contract(contractAddress, LOCK_PROXY_ABI, provider)
    const walletAddress = await contract.getWalletAddress(ownerEthAddress, swthAddress, this.network.BSC_WALLET_BYTECODE_HASH)

    return walletAddress
  }

  /**
   * @deprecated use ETHClient
   */
  public getEthProvider() {
    if (this.network.ETH_URL.length > 0) {
      return new ethers.providers.JsonRpcProvider(this.network.ETH_URL)
    }
    return ethers.getDefaultProvider(this.network.ETH_ENV)
  }

  /**
   * @deprecated use ETHClient
   */
  public getBscProvider() {
    if (this.network.BSC_URL.length > 0) {
      return new ethers.providers.JsonRpcProvider(this.network.BSC_URL)
    }
    throw new Error(`BSC_URL for network: ${this.network}, not provided`)
  }

  /**
   * @deprecated use ETHClient
   */
  public async getEthExternalBalances(address: string, whitelistDenoms?: string[]) {
    const tokenList = await this.getTokens()
    const tokens = tokenList.filter(token =>
      token.blockchain == Blockchain.Ethereum &&
      token.asset_id.length == 40 &&
      ('0x' + token.lock_proxy_hash).toLowerCase() == this.network.ETH_LOCKPROXY &&
      (!whitelistDenoms || whitelistDenoms.includes(token.denom))
    )
    const assetIds = tokens.map(token => '0x' + token.asset_id)
    const provider = this.getEthProvider()
    const contractAddress = this.network.ETH_BALANCE_READER
    const contract = new ethers.Contract(contractAddress, BALANCE_READER_ABI, provider)

    const balances = await contract.getBalances(address, assetIds)
    for (let i = 0; i < tokens.length; i++) {
      tokens[i].external_balance = balances[i].toString()
    }

    return tokens
  }

  /**
   * @deprecated use ETHClient
   */
  public async getBscExternalBalances(address: string, whitelistDenoms?: string[]) {
    const tokenList = await this.getTokens()
    const tokens = tokenList.filter(token =>
      token.blockchain == Blockchain.Ethereum &&
      token.asset_id.length == 40 &&
      ('0x' + token.lock_proxy_hash).toLowerCase() == this.network.ETH_LOCKPROXY &&
      (!whitelistDenoms || whitelistDenoms.includes(token.denom))
    )
    const assetIds = tokens.map(token => '0x' + token.asset_id)
    const provider = this.getBscProvider()
    const contractAddress = this.network.BSC_BALANCE_READER
    const contract = new ethers.Contract(contractAddress, BALANCE_READER_ABI, provider)

    const balances = await contract.getBalances(address, assetIds)
    for (let i = 0; i < tokens.length; i++) {
      tokens[i].external_balance = balances[i].toString()
    }

    return tokens
  }

  /**
   * @deprecated use ETHClient
   */
  public async approveERC20(params: ApproveERC20Params) {
    const { token, gasPriceGwei, gasLimit, ethAddress, signer } = params
    const contractAddress = token.asset_id

    const ethProvider = this.getEthProvider()
    const contract = new ethers.Contract(contractAddress, ERC20_ABI, ethProvider)

    const nonce = await ethProvider.getTransactionCount(ethAddress)
    const approveResultTx = await contract.connect(signer).approve( // eslint-disable-line no-await-in-loop
      token.lock_proxy_hash,
      ethers.constants.MaxUint256,
      {
        nonce,
        gasPrice: ethers.BigNumber.from(gasPriceGwei.shiftedBy(9).toString()),
        gasLimit: ethers.BigNumber.from(gasLimit.toString()),
      },
    )

    return approveResultTx
  }

  /**
   * @deprecated use ETHClient
   */
  public async checkAllowanceERC20(token: TokenObject, owner: string, spender: string) {
    const contractAddress = token.asset_id
    const ethProvider = this.getEthProvider()
    const contract = new ethers.Contract(contractAddress, ERC20_ABI, ethProvider)

    const allowance = await contract.allowance(owner, spender)

    return allowance
  }

  /**
   * @deprecated use ETHClient
   */
  public async lockEthDeposit(params: LockEthParams) {
    const { token, amount, gasPriceGwei, gasLimit, ethAddress, signer } = params

    if (gasLimit.lt(150000)) {
      throw new Error('Minimum gas required: 150,000')
    }

    const assetId = `0x${token.asset_id}`
    const targetProxyHash = `0x${this.getTargetProxyHash(token)}`
    const feeAddress = `0x${this.network.FEE_ADDRESS}`
    const toAssetHash = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(token.denom))

    const swthAddress = ethers.utils.hexlify(this.address)
    const contractAddress = this.network.ETH_LOCKPROXY

    const ethProvider = this.getEthProvider()

    const nonce = await ethProvider.getTransactionCount(ethAddress)
    const contract = new ethers.Contract(contractAddress, LOCK_PROXY_ABI, ethProvider)
    const lockResultTx = await contract.connect(signer).lock( // eslint-disable-line no-await-in-loop
      assetId, // _assetHash
      targetProxyHash, // _targetProxyHash
      swthAddress, // _toAddress
      toAssetHash, // _toAssetHash
      feeAddress, // _feeAddress
      [ // _values
        amount.toString(), // amount
        '0', // feeAmount
        amount.toString(), // callAmount
      ],
      {
        nonce,
        value: '0',
        gasPrice: ethers.BigNumber.from(gasPriceGwei.shiftedBy(9).toString()),
        gasLimit: ethers.BigNumber.from(gasLimit.toString()),

        // add tx value for ETH deposits, omit if ERC20 token
        ...token.asset_id === '0000000000000000000000000000000000000000' && {
          value: amount.toString(),
        },
      },
    )

    return lockResultTx
  }

  /**
   * @deprecated use ETHClient
   */
  public async lockBscDeposits(params: LockEthParams) {
    const { token, amount, gasPriceGwei, gasLimit, ethAddress, signer } = params

    if (gasLimit.lt(150000)) {
      throw new Error('Minimum gas required: 150,000')
    }

    const assetId = `0x${token.asset_id}`
    const targetProxyHash = `0x${this.getTargetProxyHash(token)}`
    const feeAddress = `0x${this.network.FEE_ADDRESS}`
    const toAssetHash = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(token.denom))
    const swthAddress = ethers.utils.hexlify(this.address)
    const contractAddress = this.network.BSC_LOCKPROXY
    const bscProvider = this.getBscProvider()
    const nonce = await bscProvider.getTransactionCount(ethAddress)
    const contract = new ethers.Contract(contractAddress, LOCK_PROXY_ABI, bscProvider)
    const lockResultTx = await contract.connect(signer).lock( // eslint-disable-line no-await-in-loop
      assetId, // _assetHash
      targetProxyHash, // _targetProxyHash
      swthAddress, // _toAddress
      toAssetHash, // _toAssetHash
      feeAddress, // _feeAddress
      [ // _values
        amount.toString(), // amount
        '0', // feeAmount
        amount.toString(), // callAmount
      ],
      {
        nonce,
        value: '0',
        gasPrice: ethers.BigNumber.from(gasPriceGwei.shiftedBy(9).toString()),
        gasLimit: ethers.BigNumber.from(gasLimit.toString()),

        // add tx value for BNB deposits, omit if ERC20 token
        ...token.asset_id === '0000000000000000000000000000000000000000' && {
          value: amount.toString(),
        },
      },
    )

    return lockResultTx
  }

  public async getNeoRpcUrl(): Promise<string> {
    try {
      const response = await fetch(`https://api.switcheo.network/v2/network/best_node`)
        .then(res => res.json())
      return response.node
    } catch {
      return this.getRandomNeoRpcUrl()
    }
  }

  public getRandomNeoRpcUrl(): string {
    const urls = this.network.NEO_URLS
    const index = Math.floor(Math.random() * urls.length)
    return urls[index]
  }

  private parseHexNum(hex: string, exp: number = 0): string {
    if (!hex || typeof (hex) !== 'string') return '0'
    const res: string = hex.length % 2 !== 0 ? `0${hex}` : hex
    return new BigNumber(res ? neonUtils.reverseHex(res) : '00', 16).shiftedBy(-exp).toString()
  }

  public async getNeoExternalBalances(address: string, url: string, whitelistDenoms?: string[]) {
    const tokenList: TokenList = await this.getTokens()
    const account = new neonWallet.Account(address)
    const tokens: TokenList = tokenList.filter(token =>
      token.blockchain == Blockchain.Neo &&
      token.asset_id.length == 40 &&
      token.lock_proxy_hash.length == 40
    )

    const client: neonRPC.RPCClient =
      new neonRPC.RPCClient(url, '2.5.2') // TODO: should we change the RPC version??

    // NOTE: fetching of tokens is chunked in sets of 15 as we may hit
    // the gas limit on the RPC node and error out otherwise
    const promises: Promise<{}>[] = // tslint:disable-line
      chunk(tokens, 75).map(async (partition: ReadonlyArray<TokenObject>) => {

        let acc = {}
        for (const token of partition) {
          if (whitelistDenoms && !whitelistDenoms.includes(token.denom)) continue
          const sb: neonScript.ScriptBuilder = new neonScript.ScriptBuilder()
          sb.emitAppCall(Neon.u.reverseHex(token.asset_id),
            'balanceOf', [neonUtils.reverseHex(account.scriptHash)])

          try {
            const response: ScriptResult = await client.invokeScript(sb.str) as ScriptResult
            acc[token.denom.toUpperCase()] = response.stack[0].type === 'Integer' // Happens on polychain devnet
              ? response.stack[0].value
              : this.parseHexNum(response.stack[0].value)

          } catch (err) {
            console.error('Could not retrieve external balance for ', token.denom)
            console.error(err)
          }

        }

        return acc
      })

    const result = await Promise.all(promises).then((results: any[]) => {
      return results.reduce((acc: {}, res: {}) => ({ ...acc, ...res }), {})
    })

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      tokens[i].external_balance = result[token.denom.toUpperCase()]
    }
    return tokens
  }

  public async signMessage(msgs: ConcreteMsg[], options: any = {}) {
    let sequence: string = options.sequence

    if (sequence === undefined || sequence === null) { // no sequence override, we get latest from blockchain
      const { result } = await this.getAccount()
      sequence = result.value.sequence
    }

    if (this.accountNumber === '0' || !this.accountNumber) {
      const { result } = await this.getAccount()
      this.accountNumber = result.value.account_number.toString()
      if (this.accountNumber === '0') {
        throw new Error('Account number still 0 after refetching. This suggests your account is not initialized with funds')
      }
    }

    const memo = options.memo || ''
    let feeAmount = (new BigNumber(msgs.length)).shiftedBy(8).toString()
    if (options && options.fee) {
      feeAmount = options.fee.amount[0].amount
    }
    const stdSignMsg = new StdSignDoc({
      accountNumber: this.accountNumber,
      chainId: this.network.CHAIN_ID,
      fee: new Fee([{
        denom: 'swth',
        amount: feeAmount,
      }], this.gas),
      memo,
      msgs,
      sequence: sequence.toString(),
    })

    if (this.signerType === 'ledger') {
      if (!this.ledger) {
        throw new Error('Ledger connection not found, please refresh the page and try again')
      }
      this.onRequestSign && this.onRequestSign(stdSignMsg)
      let signatureBase64
      try {
        const sigData = await this.ledger.sign(sortAndStringifyJSON(stdSignMsg))
        signatureBase64 = Buffer.from(sigData as number[]).toString('base64')
        return {
          pub_key: {
            type: 'tendermint/PubKeySecp256k1',
            value: this.pubKeyBase64,
          },
          signature: signatureBase64,
        }
      } finally {
        this.onSignComplete && this.onSignComplete(signatureBase64 && signatureBase64.toString())
      }
    }
    return this.sign(marshalJSON(stdSignMsg))
  }

  public async signAndBroadcast(msgs: object[], types: string[], options) {
    logger("sign and broadcast", msgs, types, options)
    if (this.useSequenceCounter === true) {
      return await this.seqSignAndBroadcast(msgs, types, options)
    }

    const concreteMsgs = this.constructConcreteMsgs(msgs, types)
    const signature = await this.signMessage(concreteMsgs, options)
    const broadcastTxBody = new Transaction(concreteMsgs, [signature], options)

    return this.broadcast(broadcastTxBody)
  }

  public async seqSignAndBroadcast(msgs: object[], types: string[], options) {
    logger("seq number", this.sequenceCounter)
    const concreteMsgs = this.constructConcreteMsgs(msgs, types)
    const id = Math.random().toString(36).substr(2, 9)
    this.broadcastQueue.push({ id, concreteMsgs, options })

    while (true) {
      // sleep for broadcastQueueIntervalTime ms
      await new Promise(resolve => setTimeout(resolve, 100))
      const result = this.broadcastResults[id]
      if (result !== undefined) {
        if (result instanceof Error)
          throw result
        delete this.broadcastResults[id]
        return result
      }
    }
  }

  private async processBroadcastQueue() {
    if (this.broadcastQueue.length === 0) {
      return
    }
    if (this.isBroadcastQueuePaused === true) {
      return
    }

    this.isBroadcastQueuePaused = true

    if (this.sequenceCounter === undefined) {
      const { result } = await this.getAccount()
      this.sequenceCounter = result.value.sequence
    }

    const ids = []
    let allConcreteMsgs = []
    let memo
    let fee
    const ONE_SWTH_FEE = "100000000"

    while (true) {
      if (this.broadcastQueue.length === 0) {
        break
      }
      if (allConcreteMsgs.length + this.broadcastQueue[0].concreteMsgs.length > 100) {
        break
      }

      const { id, concreteMsgs, options } = this.broadcastQueue[0]

      if (options && options.fee) {
        if (fee?.amount?.[0]?.amount) {
          // ugly hack to aggregate fees.
          // ideally the tx should be typed as BigNumber and
          // converted to string only during payload construction
          // somewhere below.
          const incomingFee = new BigNumber(options.fee.amount?.[0]?.amount ?? ONE_SWTH_FEE)
          const newFeeAmount = new BigNumber(fee.amount?.[0]?.amount ?? ONE_SWTH_FEE).plus(incomingFee)
          fee.amount[0].amount = newFeeAmount.toString(10)
        } else {
          fee = options.fee
        }
      }

      // there can only be one memo per txn
      // so if there is a memo, we want to put it in a queue by itself
      if (options && options.memo !== undefined && options.memo.length > 0) {
        // the queue is not empty, so we just break for now
        if (ids.length !== 0) {
          break
        }

        // the queue is empty, so we assign the memo
        memo = options.memo
      }

      ids.push(id)
      allConcreteMsgs = allConcreteMsgs.concat(concreteMsgs)

      // pop the first element, since we have enqueued it
      this.broadcastQueue.shift()

      // since there is a memo here, we just break to ensure that
      // there will only be one msg in this batch
      if (memo !== undefined) {
        break
      }
    }

    const currSequence = this.sequenceCounter.toString()
    const options = { sequence: currSequence, memo, mode: 'block', fee }
    // if (fee !== null) {
    //   options.fee = fee
    // }

    let response, rawLogs, error
    try {
      logger("sign tx with seq number", options.sequence)
      const signature = await this.signMessage(allConcreteMsgs, options)
      const broadcastTxBody = new Transaction(allConcreteMsgs, [signature], options)

      response = await this.broadcast(broadcastTxBody)

      if (response?.raw_log === SEQ_NUM_ERROR) {
        logger("encountered unauthorized signature error")
        // reset seq number and retry tx once
        const { result } = await this.getAccount()
        this.sequenceCounter = result.value.sequence
        options.sequence = this.sequenceCounter.toString()
        logger("retry sign tx with seq number", options.sequence)
        const signature = await this.signMessage(allConcreteMsgs, options)
        const broadcastTxBody = new Transaction(allConcreteMsgs, [signature], options)
        response = await this.broadcast(broadcastTxBody)
      }

      response.sequence = options.sequence

      try {
        rawLogs = JSON.parse(response.raw_log)
      } catch (e) {
        // ignore parsing error
      }

      // increment sequence counter only if tx not added to chain
      if (response.height && response.height !== '0') {
        this.sequenceCounter++
      }
    } catch (e) {
      error = e
    }

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      if (error) {
        // store error as result as workaround
        // need to develop better error handling structure
        this.broadcastResults[id] = error
        continue
      }
      const responseCopy = JSON.parse(JSON.stringify(response))
      if (response.logs !== undefined) {
        responseCopy.logs = [response.logs[i]]
      }
      if (rawLogs !== undefined) {
        responseCopy.raw_log = JSON.stringify([rawLogs[i]])
      }
      this.broadcastResults[id] = responseCopy
    }

    if (response?.raw_log === SEQ_NUM_ERROR) {
      // reset sequenceCounter
      this.sequenceCounter = undefined
    }

    this.isBroadcastQueuePaused = false
  }

  private constructConcreteMsgs(msgs: object[], types: string[]) {
    if (msgs.length != types.length) throw new Error('Msg length is not equal to types length')
    if (msgs.length > 100) throw new Error('Cannot broadcast more than 100 messages in 1 transaction')

    let concreteMsgs: ConcreteMsg[] = []
    // format message with concrete codec type
    for (let i = 0; i < msgs.length; i++) {
      concreteMsgs[i] = {
        type: types[i],
        value: msgs[i],
      }
    }

    return concreteMsgs
  }
}

export function getPrivKeyFromMnemonic(mnemonic) {
  const path = getPath()
  const seed = bip39.mnemonicToSeedSync(mnemonic, '')
  const masterKey = bip32.fromSeed(seed)
  const hd = masterKey.derivePath(path)

  const privateKey = hd.privateKey
  if (!privateKey) {
    throw new Error('null hd key')
  }
  return privateKey.toString('hex')
}

export function newAccount(net: string) {
  const network = getNetwork(net)
  const mnemonic = bip39.generateMnemonic()
  const privateKey = getPrivKeyFromMnemonic(mnemonic)
  const pubKeyBech32 = new PrivKeySecp256k1(Buffer.from(privateKey, 'hex')).toPubKey().toAddress().toBech32(getBech32Prefix(network))
  return {
    mnemonic,
    privateKey,
    pubKeyBech32,
  }
}

export function accountFromMnemonic(mnemonic, net: string) {
  const network = getNetwork(net)
  const privateKey = getPrivKeyFromMnemonic(mnemonic)
  const pubKeyBech32 = new PrivKeySecp256k1(Buffer.from(privateKey, 'hex')).toPubKey().toAddress().toBech32(getBech32Prefix(network))
  return {
    mnemonic,
    privateKey,
    pubKeyBech32,
  }
}
