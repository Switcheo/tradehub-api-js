import BigNumber from "bignumber.js";
import { APIClient } from "../api";
import { Network, SimpleMap } from "../utils";
import { TradeHubSigner, TradeHubWallet } from "../wallet";
import { ModOrder } from "./modules";
import { SDKProvider } from "./modules/module";

export interface TradeHubSDKInitOpts {
  network?: Network
  debugMode?: boolean
  txFees?: SimpleMap<BigNumber>
}

const DEFAULT_OPTS: TradeHubSDKInitOpts = {
  network: Network.MainNet,
}

class TradeHubSDK implements SDKProvider {
  static Network = Network

  network: Network
  api: APIClient
  debugMode: boolean

  // modules
  order: ModOrder

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

    // initialize modules
    this.order = new ModOrder(this);
  }

  public generateOpts(): TradeHubSDKInitOpts {
    return {
      network: this.network,
      debugMode: this.debugMode,
      txFees: this.txFees,
    }
  }

  public log(...args: any[]) {
    if (this.debugMode) {
      console.log.apply(console.log, [this.constructor.name, ...args]);
    }
  }

  public async reloadTxnFees() {
    this.log("reloadTxnFees…");
    this.txFees = await this.api.getTxnFees();
  }

  /* CONNECT WALLET FUNCTIONS */

  public async initialize(wallet?: TradeHubWallet) {
    this.log("initialize…");
    await this.reloadTxnFees();

    if (wallet) {
      this.log("reloading wallet account");
      await wallet.reloadAccount();

      this.log("update wallet account", wallet.account, "sequence", wallet.sequence);
    }

    this.log("initialize complete");
  }

  public async connect(wallet: TradeHubWallet) {
    await this.initialize(wallet);
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

  public getConnectedWallet(): TradeHubWallet {
    return this.checkWallet();
  }

  public async loadAccount() {
    const wallet = this.checkWallet();
    const account = await wallet.reloadAccount();
    return account;
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
