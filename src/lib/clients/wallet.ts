import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import fetch from 'node-fetch'
import { BigNumber } from 'bignumber.js'
import Dagger from '@maticnetwork/eth-dagger'
import { ethers } from 'ethers'
import { CONFIG, getBech32Prefix, getNetwork, Network } from '../config'
import { Fee, StdSignDoc, Transaction } from '../containers'
import { marshalJSON, sortAndStringifyJSON } from '../utils/encoder'
import { Address, getPath, getPathArray, PrivKeySecp256k1, PubKeySecp256k1 } from '../utils/wallet'
import { ConcreteMsg } from '../containers/Transaction'
import { HDWallet } from '../utils/hdwallet'
import BALANCE_READER_ABI from '../eth/abis/balanceReader.json'
import WALLET_FACTORY_ABI from '../eth/abis/walletFactory.json'
import { Blockchain, ETH_WALLET_BYTECODE } from '../constants'
import Neon, { nep5, api, u } from "@cityofzion/neon-js"
import stripHexPrefix from 'strip-hex-prefix'
import CosmosLedger from '@lunie/cosmos-ledger'

export type SignerType = 'ledger' | 'mnemonic' | 'privateKey'
export type OnRequestSignCallback = (signDoc: StdSignDoc) => void
export type OnSignCompleteCallback = (signature: string) => void
export interface SignMessageOptions { memo?: string, sequence?: string }
export interface WalletConstructorParams {
  accountNumber: string
  network: Network
  useSequenceCounter?: boolean // default true
  broadcastQueueIntervalTime?: number // default 100 (ms)
  pubKey?: Array<Number>
  pubKeyBech32?: string
  mnemonic?: string
  privateKey?: string
  gas?: string // default CONFIG.default_gas
  signerType?: SignerType // default privateKey
  onRequestSign?: OnRequestSignCallback
  onSignComplete?: OnSignCompleteCallback
}
export interface BroadcastQueueItem { id: string, concreteMsgs: ConcreteMsg[], options: any }
export interface BroadcastResults {
  [id: string]: any
}

export class WalletClient {
  public static async connectMnemonic(mnemonic: string, net?: string) {
    const network = getNetwork(net)
    const privateKey = getPrivKeyFromMnemonic(mnemonic)
    const pubKeyBech32 = new PrivKeySecp256k1(Buffer.from(privateKey, 'hex')).toPubKey().toAddress().toBech32(getBech32Prefix(network, 'main'))
    const { result: { value }} = await fetch(`${network.REST_URL}/get_account?account=${pubKeyBech32}`)
      .then(res => res.json())
    return new WalletClient({ mnemonic, accountNumber: value.account_number.toString(), network, signerType: 'mnemonic' })
  }

  public static async connectPrivateKey(privateKey: string, net?: string) {
    const network = getNetwork(net)
    const pubKeyBech32 = new PrivKeySecp256k1(Buffer.from(privateKey, 'hex')).toPubKey().toAddress().toBech32(getBech32Prefix(network, 'main'))
    const { result: { value }} = await fetch(`${network.REST_URL}/get_account?account=${pubKeyBech32}`)
      .then(res => res.json())
    return new WalletClient({ privateKey, accountNumber: value.account_number.toString(), network, signerType: 'privateKey' })
  }

  public static async connectLedger(cosmosLedger: any, net = 'TESTNET',
                                    onRequestSign: OnRequestSignCallback,
                                    onSignComplete: OnSignCompleteCallback) {
    const network = getNetwork(net)
    const pubKeyBech32 = await cosmosLedger.getCosmosAddress()
    const pubKey = await cosmosLedger.getPubKey()

    const { result: { value }} = await fetch(`${network.REST_URL}/get_account?account=${pubKeyBech32}`)
      .then(res => res.json())
    return new WalletClient({
      accountNumber: value.account_number.toString(),
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

    const { result: { value }} = await fetch(`${network.REST_URL}/get_account?account=${pubKeyBech32}`)
      .then(res => res.json())
    return new WalletClient({ accountNumber: value.account_number.toString(), network, pubKeyBech32 })
  }

  public readonly mnemonic?: string
  public readonly hdWallet: HDWallet
  public readonly privKey: PrivKeySecp256k1
  public readonly address: Uint8Array
  public readonly addressHex: string
  public readonly pubKeySecp256k1: PubKeySecp256k1
  public readonly pubKeyBase64: string
  public readonly pubKeyBech32: string
  public readonly validatorBech32: string
  public readonly consensusBech32: string
  public readonly gas: string
  public readonly signerType: SignerType
  public readonly network: Network
  public readonly feeMultiplier: BigNumber // feeAmount * feeMultiplier = min deposit / withdrawal amount
  public accountNumber: string
  public broadcastMode: string
  public depositAddresses: {[key: string]: string}
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
      gas = CONFIG.DEFAULT_GAS,
      onRequestSign,
      onSignComplete,
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

      this.pubKeySecp256k1 = this.privKey.toPubKey()
      address = this.pubKeySecp256k1.toAddress()
      this.pubKeyBase64 = this.pubKeySecp256k1.pubKey.toString('base64')
    } else if (privateKey) {
      this.privKey = new PrivKeySecp256k1(Buffer.from(privateKey, 'hex'))
      this.pubKeySecp256k1 = this.privKey.toPubKey()
      address = this.pubKeySecp256k1.toAddress()
      this.pubKeyBase64 = this.pubKeySecp256k1.pubKey.toString('base64')
    } else {
      this.pubKeySecp256k1 = new PubKeySecp256k1(Buffer.from(pubKey as number[]))
      this.pubKeyBase64 = this.pubKeySecp256k1.pubKey.toString('base64')
      address = Address.fromBech32(getBech32Prefix(network, 'main'), pubKeyBech32)
    }
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
    this.onRequestSign = onRequestSign
    this.onSignComplete = onSignComplete
    this.feeMultiplier = new BigNumber(2)

    this.useSequenceCounter = useSequenceCounter
    this.broadcastQueueIntervalTime = broadcastQueueIntervalTime
    this.broadcastQueue = []
    this.broadcastResults = {}

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

  public broadcast(body) {
    return fetch(`${this.network.REST_URL}/txs`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => res.json()) // expecting a json response
  }

  public getValidators() {
    return fetch(`${this.network.REST_URL}/get_validators`)
      .then(res => res.json()) // expecting a json response
  }

  public getAccount() {
    return fetch(`${this.network.REST_URL}/get_account?account=${this.pubKeyBech32}`)
      .then(res => res.json()) // expecting a json response
  }

  public getTokens() {
    return fetch(`${this.network.REST_URL}/get_tokens`)
      .then(res => res.json()) // expecting a json response
  }

  public getToken(token: string) {
    return fetch(`${this.network.REST_URL}/token?token=${token}`)
      .then(res => res.json()) // expecting a json response
  }

  public getMarkets() {
    return fetch(`${this.network.REST_URL}/get_markets`)
      .then(res => res.json()) // expecting a json response
  }

  public getMarket(market: string) {
    return fetch(`${this.network.REST_URL}/get_market?market=${market}`)
      .then(res => res.json()) // expecting a json response
  }

  public getOrderbook(market: string) {
    return fetch(`${this.network.REST_URL}/get_orderbook?market=${market}`)
      .then(res => res.json()) // expecting a json response
  }

  public getOrder(orderID: string) {
    return fetch(`${this.network.REST_URL}/get_order?order_id=${orderID}`)
      .then(res => res.json()) // expecting a json response
  }

  public getOrders() {
    return fetch(`${this.network.REST_URL}/get_orders?account=${this.pubKeyBech32}`)
      .then(res => res.json()) // expecting a json response
  }

  public getOpenOrders() {
    return fetch(`${this.network.REST_URL}/get_orders?account=${this.pubKeyBech32}&order_status=open`)
      .then(res => res.json()) // expecting a json response
  }

  public getWalletBalance() {
    return fetch(`${this.network.REST_URL}/get_balance?account=${this.pubKeyBech32}`)
      .then(res => res.json()) // expecting a json response
  }

  public getLeverage(market: string) {
    return fetch(`${this.network.REST_URL}/get_leverage?market=${market}&account=${this.pubKeyBech32}`)
      .then(res => res.json()) // expecting a json response
  }

  public getPosition(market: string) {
    return fetch(`${this.network.REST_URL}/get_position?account=${this.pubKeyBech32}&market=${market}`)
      .then(res => res.json()) // expecting a json response
  }

  public getTransfers() {
    return fetch(`${this.network.REST_URL}/get_external_transfers?account=${this.pubKeyBech32}`)
        .then(res => res.json()); // expecting a json response
  }

  public async watchDepositAddresses() {
    if (this.network.NAME !== 'mainnet') {
      return
    }
    this.watchNeoDepositAddress()
  }

  public async watchNeoDepositAddress() {
    const address = await this.getDepositAddress(Blockchain.Neo)
    await this.sendNeoDeposits(address)

    // check every 15 seconds
    this.neoDepositsIntervalId = <any>setInterval(() => {
      this.sendNeoDeposits(address)
    }, 15 * 1000)
  }

  public async sendNeoDeposits(address) {
    const urls = [
      "https://vlqvfsx107.execute-api.ap-southeast-1.amazonaws.com", // ngd proxy seed1
      "https://qtl81e9fhb.execute-api.ap-southeast-1.amazonaws.com", // ngd proxy seed2
      "https://vonfbyseb2.execute-api.ap-southeast-1.amazonaws.com", // ngd proxy seed3
      "https://cn2t0g46mi.execute-api.ap-southeast-1.amazonaws.com", // ngd proxy seed4
      "https://ojgox44quf.execute-api.ap-southeast-1.amazonaws.com", // ngd proxy seed10
    ]

    // shuffle urls
    for (let i = urls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = urls[i]
      urls[i] = urls[j]
      urls[j] = temp
    }

    let tokens
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      try {
        tokens = await this.getNeoExternalBalances(address, url)
        break
      } catch (e) {
        console.log('could not fetch balance, will try another endpoint, current endpoint', url)
        continue
      }
    }

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (token.externalBalance !== undefined && token.externalBalance !== '0') {
        this.sendNeoDeposit(token)
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

  public async getFeeInfo(token) {
    const url = this.network.FEE_URL + '/fees?denom=' + token.denom
    const result = await fetch(url).then(res => res.json())
    if (result && result.details) {
      return result.details
    }
  }

  public async sendNeoDeposit(token) {
    const privateKey = this.hdWallet[Blockchain.Neo]
    const account = Neon.create.account(privateKey)

    const scriptHash = this.network.NEO_LOCKPROXY

    const fromAssetHash = token.asset_id
    const fromAddress = u.reverseHex(account.scriptHash)
    const targetProxyHash = this.getTargetProxyHash(token)
    const toAssetHash = u.str2hexstring(token.denom)
    const toAddress = this.addressHex

    const amount = new BigNumber(token.externalBalance)
    const feeAmount = new BigNumber('100000000')
    const feeAddress = this.network.FEE_ADDRESS
    const nonce = Math.floor(Math.random() * 1000000)

    if (amount.isLessThan(feeAmount)) {
      return
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

    const rpcUrl = this.getNeoWriteRpcUrl()
    const apiProvider = new api.neoCli.instance(rpcUrl)
    await Neon.doInvoke({
      api: apiProvider,
      url: rpcUrl,
      account,
      script: sb.str,
      gas: 0,
      fees: 0
    })
  }

  public async watchEthDepositAddress() {
    const address = await this.getDepositAddress(Blockchain.Ethereum)
    // do an initial check
    await this.sendEthDeposits(address)

    const dagger = new Dagger(this.network.ETH_WS_URL)
    // watch for Ethereum transfers
    dagger.on(`latest:addr/${address}/tx/in`, () => {
      this.sendEthDeposits(address)
    })

    // watch for Ethereum token transfers
    const transferId = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    dagger.on(`latest:log/+/filter/${transferId}/+/${address}/#`, () => {
      this.sendEthDeposits(address)
    })
  }

  public async sendEthDeposits(address) {
    const tokens = await this.getEthExternalBalances(address)
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (!token.externalBalance.isZero()) {
        // send the deposit in 30 seconds to avoid problems with block re-orgs
        // if the deposit is sent too early, and there is a block re-org then the
        // ethpayer service might check and see that there is no token balance and
        // it would ignore the request
        setTimeout(async () => {
          try {
            this.sendEthDeposit(token, address)
          } catch (e) {
            console.log('could not send deposit', e)
          }
        }, 30)
      }
    }
  }

  public async isEthContract(address) {
    const provider = ethers.getDefaultProvider(this.network.ETH_ENV)
    const code = await provider.getCode(address)
    // non-contract addresses should return 0x
    return code != '0x'
  }

  public async getDepositFeeAmount(token, depositAddress) {
    const feeInfo = await this.getFeeInfo(token)
    if (!feeInfo || !feeInfo.deposit || !feeInfo.deposit.fee) {
      throw new Error('unsupported token')
    }

    let feeAmount = new BigNumber(feeInfo.deposit.fee)
    if (token.blockchain == Blockchain.Ethereum) {
      const walletContractDeployed = await this.isEthContract(depositAddress)
      if (!walletContractDeployed) {
        feeAmount = feeAmount.plus(new BigNumber(feeInfo.createWallet.fee))
      }
    }

    return feeAmount
  }

  public async getWithdrawalFeeAmount(token) {
    const feeInfo = await this.getFeeInfo(token)
    if (!feeInfo || !feeInfo.withdrawal || !feeInfo.withdrawal.fee) {
      throw new Error('unsupported token')
    }

    return new BigNumber(feeInfo.withdrawal.fee)
  }

  public async getMinDepositAmount(token, depositAddress) {
    const fee = await this.getDepositFeeAmount(token, depositAddress)
    return fee.multipliedBy(this.feeMultiplier)
  }

  public async getMinWithdrawalAmount(token) {
    const fee = await this.getWithdrawalFeeAmount(token)
    return fee.multipliedBy(this.feeMultiplier)
  }

  public async sendEthDeposit(token, depositAddress) {
    const feeAmount = await this.getDepositFeeAmount(token, depositAddress)
    const amount = new BigNumber(token.externalBalance)
    if (amount.isLessThan(feeAmount.multipliedBy(this.feeMultiplier))) {
      return 'insufficient balance'
    }

    const assetId = '0x' + token.asset_id
    const targetProxyHash = '0x' + this.getTargetProxyHash(token)
    const feeAddress = '0x' + this.network.FEE_ADDRESS
    const toAssetHash = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(token.denom))
    const nonce = Math.floor(Math.random() * 1000000000) // random nonce to prevent replay attacks
    const message = ethers.utils.solidityKeccak256(
      ['string', 'address', 'bytes', 'bytes', 'bytes', 'uint256', 'uint256', 'uint256'],
      ['sendTokens', assetId, targetProxyHash, toAssetHash, feeAddress, amount.toString(), feeAmount.toString(), nonce]
    )
    const messageBytes = ethers.utils.arrayify(message)

    const privateKey = this.hdWallet[Blockchain.Ethereum]
    const etherWallet = new ethers.Wallet(privateKey)
    const owner = etherWallet.address
    const signature = await etherWallet.signMessage(messageBytes)
    const rsv = ethers.utils.splitSignature(signature)

    const swthAddress = ethers.utils.hexlify(this.address)
    const body = {
      OwnerAddress: owner,
      SwthAddress: swthAddress,
      AssetHash: assetId,
      TargetProxyHash: targetProxyHash,
      ToAssetHash: toAssetHash,
      Amount: amount.toString(),
      FeeAmount: feeAmount.toString(),
      FeeAddress: feeAddress,
      Nonce: nonce.toString(),
      CallAmount: amount.toString(),
      V: rsv.v.toString(),
      R: rsv.r,
      S: rsv.s,
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
    } else {
      return 'unsupported blockchain'
    }

    this.depositAddresses[blockchain] = depositAddress
    return depositAddress
  }

  public async getNeoDepositAddress() {
    const privateKey = this.hdWallet[Blockchain.Neo]
    const account = Neon.create.account(privateKey)
    return account.address
  }

  public async getEthDepositAddress() {
    const swthAddress = ethers.utils.hexlify(this.address)
    const privateKey = this.hdWallet[Blockchain.Ethereum]
    const owner = (new ethers.Wallet(privateKey)).address

    const provider = ethers.getDefaultProvider(this.network.ETH_ENV)
    const contractAddress = this.network.ETH_LOCKPROXY
    const contract = new ethers.Contract(contractAddress, WALLET_FACTORY_ABI, provider)
    const walletAddress = await contract.getWalletAddress(owner, swthAddress, ETH_WALLET_BYTECODE)

    return walletAddress
  }

  public async getEthExternalBalances(address: string) {
    const tokenList = await this.getTokens()
    const tokens = tokenList.filter(token =>
      token.blockchain == Blockchain.Ethereum &&
      token.asset_id.length == 40 &&
      token.lockproxy_hash.length == 40
    )
    const assetIds = tokens.map(token => '0x' + token.asset_id)
    const provider = ethers.getDefaultProvider(this.network.ETH_ENV)
    const contractAddress = this.network.ETH_BALANCE_READER
    const contract = new ethers.Contract(contractAddress, BALANCE_READER_ABI, provider)

    const balances = await contract.getBalances(address, assetIds)
    for (let i = 0; i < tokens.length; i++) {
      tokens[i].externalBalance = balances[i]
    }

    return tokens
  }

  public getNeoWriteRpcUrl() {
    if (this.network.NEO_URL.length > 0) {
      return this.network.NEO_URL
    }

    const urls = [
      'https://explorer.o3node.org:443',
      'https://main.neologin.io:443'
    ]
    const index = Math.floor(Math.random() * urls.length)
    return urls[index]
  }

  public async getNeoExternalBalances(address: string, url: string) {
    const tokenList = await this.getTokens()
    const tokens = tokenList.filter(token =>
      token.blockchain == Blockchain.Neo &&
      token.asset_id.length == 40 &&
      token.lockproxy_hash.length == 40 &&
      token.denom === 'swth'
    )
    const assetIds = tokens.map(token => Neon.u.reverseHex(token.asset_id))
    const provider = url

    const balances = await nep5.getTokenBalances(
      provider,
      assetIds,
      address
    )

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      tokens[i].externalBalance = balances[token.symbol.toUpperCase()].toRawNumber().toString()
    }

    return tokens
  }

  public async signMessage(msgs: ConcreteMsg[], options: SignMessageOptions = {}) {
    let sequence: string = options.sequence

    if (sequence === undefined || sequence === null) { // no sequence override, we get latest from blockchain
      const { result } = await this.getAccount()
      sequence = result.value.sequence
    }

    if (this.accountNumber === "0" || this.accountNumber === undefined || this.accountNumber === null) {
      const { result } = await this.getAccount()
      this.accountNumber = result.value.account_number.toString()
      if (this.accountNumber === "0") {
        throw new Error("Account number still 0 after refetching. This suggests your account is not initialized with funds")
      }
    }

    const memo = options.memo || ''
    const stdSignMsg = new StdSignDoc({
      accountNumber: this.accountNumber,
      chainId: this.network.CHAIN_ID,
      fee: new Fee([{denom: 'swth', amount: (new BigNumber(msgs.length)).shiftedBy(8).toString()}], this.gas),
      memo,
      msgs,
      sequence: sequence.toString(),
    })

    if (this.signerType === 'ledger') {
      const ledger = await new CosmosLedger({},
        getPathArray(), // HDPATH
        getBech32Prefix(this.network, 'main'), // BECH32PREFIX
      ).connect()
      this.onRequestSign && this.onRequestSign(stdSignMsg)
      const sigData = await ledger.sign(sortAndStringifyJSON(stdSignMsg))
      const signatureBase64 = Buffer.from(sigData as number[]).toString('base64')
      this.onSignComplete && this.onSignComplete(signatureBase64.toString())
      return {
        pub_key: {
          type: 'tendermint/PubKeySecp256k1',
          value: this.pubKeyBase64,
        },
        signature: signatureBase64,
      }
    }
    return this.sign(marshalJSON(stdSignMsg))
  }

  public async signAndBroadcast(msgs: object[], types: string[], options) {
    if (this.useSequenceCounter === true) {
      return await this.seqSignAndBroadcast(msgs, types, options)
    }

    const concreteMsgs = this.constructConcreteMsgs(msgs, types)
    const signature = await this.signMessage(concreteMsgs, options)
    const broadcastTxBody = new Transaction(concreteMsgs, [signature], options)

    return this.broadcast(broadcastTxBody)
  }

  public async seqSignAndBroadcast(msgs: object[], types: string[], options) {
    const concreteMsgs = this.constructConcreteMsgs(msgs, types)
    const id = Math.random().toString(36).substr(2, 9)
    this.broadcastQueue.push({ id, concreteMsgs, options })

    while (true) {
      // sleep for broadcastQueueIntervalTime ms
      await new Promise(resolve => setTimeout(resolve, 100))
      const result = this.broadcastResults[id]
      if (result !== undefined) {
        delete this.broadcastResults[id]
        return result
      }
    }
  }

  private async processBroadcastQueue() {
    if (this.broadcastQueue.length === 0) { return }
    if (this.isBroadcastQueuePaused === true) { return }

    this.isBroadcastQueuePaused = true

    if (this.sequenceCounter === undefined) {
      const { result } = await this.getAccount()
      this.sequenceCounter = result.value.sequence
    }

    const ids = []
    let allConcreteMsgs = []
    let memo

    while (true) {
      if (this.broadcastQueue.length === 0) { break }
      if (allConcreteMsgs.length + this.broadcastQueue[0].concreteMsgs.length > 100) { break }

      const { id, concreteMsgs, options } = this.broadcastQueue[0]

      // there can only be one memo per txn
      // so if there is a memo, we want to put it in a queue by itself
      if (options && options.memo !== undefined && options.memo.length > 0){
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
    const options = { sequence: currSequence, memo, mode: 'block' }
    this.sequenceCounter++

    const signature = await this.signMessage(allConcreteMsgs, options)
    const broadcastTxBody = new Transaction(allConcreteMsgs, [signature], options)

    const response = await this.broadcast(broadcastTxBody)
    response.sequence = currSequence

    let rawLogs
    try {
      rawLogs = JSON.parse(response.raw_log)
    } catch (e) {
      // ignore parsing error
    }

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      const responseCopy = JSON.parse(JSON.stringify(response))
      if (response.logs !== undefined) {
        responseCopy.logs = [response.logs[i]]
      }
      if (rawLogs !== undefined) {
        responseCopy.raw_log = JSON.stringify([rawLogs[i]])
      }
      this.broadcastResults[id] = responseCopy
    }

    const isInvalidSequence = response.raw_log === 'unauthorized: signature verification failed; verify correct account sequence and chain-id'
    if (isInvalidSequence) {
      // reset sequenceCounter
      this.sequenceCounter = undefined
    }

    this.isBroadcastQueuePaused = false
  }

  private constructConcreteMsgs(msgs: object[], types: string[]) {
    if (msgs.length != types.length) throw new Error("Msg length is not equal to types length")
    if (msgs.length > 100) throw new Error("Cannot broadcast more than 100 messages in 1 transaction")

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
    throw new Error("null hd key")
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