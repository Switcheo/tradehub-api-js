import BigNumber from "bignumber.js";
import { Network, SimpleMap } from "../utils";
import { TradeHubSigner, TradeHubWallet } from "../wallet";
import APIClient from "./APIClient";

export interface TradeHubSDKInitOpts {
  network?: Network
  debugMode?: boolean
  txFees?: SimpleMap<BigNumber>
}

const DEFAULT_OPTS: TradeHubSDKInitOpts = {
  network: Network.MainNet,
}

class TradeHubSDK {
  static Network = Network

  network: Network
  api: APIClient
  debugMode: boolean

  // initialized by calling TradeHubSDK.connect(TradeHubWallet)
  wallet?: TradeHubWallet
  txFees?: SimpleMap<BigNumber>

  constructor(opts: TradeHubSDKInitOpts = DEFAULT_OPTS) {
    this.debugMode = opts.debugMode ?? false

    this.network = opts.network
    this.api = new APIClient(this.network)
    this.txFees = opts.txFees

    this.log("constructor result opts", this.generateOpts())

    if (this.debugMode) {
      this.log("setting BigNumber print mode for console logs")
      BigNumber.prototype[require('util').inspect.custom] = BigNumber.prototype.valueOf;
    }
  }

  public generateOpts(): TradeHubSDKInitOpts {
    return {
      network: this.network,
      debugMode: this.debugMode,
      txFees: this.txFees,
    }
  }

  public log(...args) {
    if (this.debugMode) {
      console.log.apply(console.log, [this.constructor.name, ...args]);
    }
  }

  public async reloadTxnFees() {
    this.log("reloadTxnFees…");
    this.txFees = await this.api.getTxnFees();
  }

  /* CONNECT WALLET FUNCTIONS */

  public async initialize() {
    this.log("initialize…");
    await this.reloadTxnFees();
    this.log("initialize complete");
  }

  public async connect(wallet: TradeHubWallet) {
    await this.initialize();
    return new ConnectedTradeHubSDK(wallet, this.generateOpts())
  }

  public async connectWithPrivateKey(privateKey: string | Buffer) {
    const wallet = TradeHubWallet.initWithPrivateKey(privateKey, {
      debugMode: this.debugMode,
      network: this.network,
    })
    return this.connect(wallet)
  }

  public async connectWithMnemonic(mnemonic: string) {
    const wallet = TradeHubWallet.initWithMnemonic(mnemonic, {
      debugMode: this.debugMode,
      network: this.network,
    })
    return this.connect(wallet)
  }

  public async connectWithSigner(signer: TradeHubSigner, bech32Address: string) {
    const wallet = TradeHubWallet.initWithSigner(signer, bech32Address, {
      debugMode: this.debugMode,
      network: this.network,
    })
    return this.connect(wallet)
  }

  private checkWallet(): TradeHubWallet {
    if (!this.wallet) {
      throw new Error("wallet not connected")
    }

    return this.wallet
  }

  public async loadAccount() {
    const wallet = this.checkWallet()
    const address = wallet.bech32Address
    return this.api.getAccount({ address })
  }
}

class ConnectedTradeHubSDK extends TradeHubSDK {
  wallet: TradeHubWallet

  constructor(wallet: TradeHubWallet, opts: TradeHubSDKInitOpts = DEFAULT_OPTS) {
    super(opts)

    if (!opts.txFees) {
      console.warn("ConnectedTradeHubSDK initialized without gas fees map.")
    }

    this.wallet = wallet
  }
}

export default TradeHubSDK
