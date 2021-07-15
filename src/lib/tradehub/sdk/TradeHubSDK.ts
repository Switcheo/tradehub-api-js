import BigNumber from "bignumber.js";
import { APIClient, TMClient } from "../api";
import * as _RestTypes from "../api/spec";
import { ETHClient, NEOClient } from "../clients";
import TokenClient from "../clients/TokenClient";
import { ZILClient } from "../clients/ZILClient";
import { RestModels as _RestModels, RPCParams as _RPCParams } from "../models";
import { Blockchain, Network, Network as _Network, NetworkConfig, NetworkConfigProvider, NetworkConfigs, SimpleMap } from "../utils";
import { TradeHubSigner, TradeHubWallet, TradeHubWalletGenericOpts } from "../wallet";
import { WSConnector, WSSubscriber } from "../websocket";
import { WSChannel } from "../websocket/types";
import { ModAccount, ModAdmin, ModBroker, ModCDP, ModCoin, ModGovernance, ModLeverage, ModLiquidityPool, ModMarket, ModOracle, ModOrder, ModPosition } from "./modules";
import { SDKProvider } from "./modules/module";
import ModStaking from "./modules/staking";
import CosmosLedger from '@lunie/cosmos-ledger'

export * as RestTypes from "../api/spec";
export * from "../models";
/** @deprecated use RestModels */
export { RestModels as RestResponse } from "../models";
export * as TradeHubTx from "../utils/tx";

export interface TradeHubSDKInitOpts {
  network?: Network
  debugMode?: boolean
  ws?: WSConnector
  txFees?: SimpleMap<BigNumber>

  config?: Partial<NetworkConfig>
}

const DEFAULT_OPTS: TradeHubSDKInitOpts = {
  network: Network.MainNet,
}

class TradeHubSDK implements SDKProvider, NetworkConfigProvider {
  static APIClient = APIClient
  static TokenClient = TokenClient

  network: Network
  api: APIClient
  tm: TMClient
  debugMode: boolean
  configOverride: Partial<NetworkConfig>
  initialized: boolean

  networkConfig: NetworkConfig

  ws?: WSConnector

  neo: NEOClient
  eth: ETHClient
  bsc: ETHClient
  zil: ZILClient

  token: TokenClient

  // modules
  admin: ModAdmin
  account: ModAccount
  order: ModOrder
  coin: ModCoin
  market: ModMarket
  governance: ModGovernance
  leverage: ModLeverage
  lp: ModLiquidityPool
  broker: ModBroker
  position: ModPosition
  cdp: ModCDP
  oracle: ModOracle
  staking: ModStaking

  // initialized by calling TradeHubSDK.connect(TradeHubWallet)
  wallet?: TradeHubWallet
  txFees?: SimpleMap<BigNumber>

  constructor(opts: TradeHubSDKInitOpts = DEFAULT_OPTS) {
    this.debugMode = opts.debugMode ?? false

    this.network = opts.network ?? DEFAULT_OPTS.network;
    this.configOverride = opts.config ?? {};
    this.txFees = opts.txFees;
    this.initialized = false;

    this.networkConfig = {
      ...NetworkConfigs[this.network],
      ...this.configOverride,
    };

    this.api = new APIClient(this.networkConfig.RestURL, {
      debugMode: this.debugMode,
    });
    this.tm = new TMClient(this.networkConfig.TendermintURL, {
      debugMode: this.debugMode,
    });

    this.log("constructor result opts", this.generateOpts())

    if (this.debugMode) {
      this.log("setting BigNumber print mode for console logs")
      BigNumber.prototype[require('util').inspect.custom] = BigNumber.prototype.valueOf;
    }

    this.neo = NEOClient.instance({
      configProvider: this,
    });

    this.eth = ETHClient.instance({
      configProvider: this,
      blockchain: Blockchain.Ethereum,
    });

    this.bsc = ETHClient.instance({
      configProvider: this,
      blockchain: Blockchain.BinanceSmartChain,
    });

    this.zil = ZILClient.instance({
      configProvider: this,
      blockchain: Blockchain.Zilliqa,
    })

    this.token = TokenClient.instance(this.api);

    // initialize modules
    this.order = new ModOrder(this);
    this.market = new ModMarket(this);
    this.governance = new ModGovernance(this);
    this.lp = new ModLiquidityPool(this);
    this.admin = new ModAdmin(this);
    this.coin = new ModCoin(this);
    this.account = new ModAccount(this);
    this.leverage = new ModLeverage(this);
    this.broker = new ModBroker(this);
    this.position = new ModPosition(this);
    this.cdp = new ModCDP(this);
    this.oracle = new ModOracle(this);
    this.staking = new ModStaking(this);
  }

  protected async startWS() {
    if (!this.ws?.connected) {
      this.ws = new WSConnector({
        endpoint: this.networkConfig.WsURL,
        debugMode: this.debugMode,
      });
      await this.ws.connect();
    }
  }

  public getConfig(): NetworkConfig {
    return this.networkConfig;
  }

  public generateOpts(): TradeHubSDKInitOpts {
    return {
      network: this.network,
      debugMode: this.debugMode,
      txFees: this.txFees,
      config: this.configOverride,
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

  public static parseNetwork(network: string, defaultNetwork: Network | null = DEFAULT_OPTS.network) {
    switch (network?.toLowerCase?.()) {
      case "main":
      case "mainnet":
        return Network.MainNet;
      case "test":
      case "testnet":
        return Network.TestNet;
      case "dev":
      case "devnet":
        return Network.DevNet;
      case "local":
      case "localhost":
        return Network.LocalHost;
    }

    return defaultNetwork;
  }

  /* CONNECT WALLET FUNCTIONS */

  public async initialize(wallet?: TradeHubWallet) {
    this.log("initialize…");
    if (!this.initialized) {
      await this.reloadTxnFees();
      await this.token.initialize();
      this.initialized = true;
    }

    if (wallet) {
      this.wallet = wallet;

      this.log("reloading wallet account");
      await wallet.init();

      this.log("update wallet account", wallet.account, "sequence", wallet.sequence);

      if (wallet.account === 0) {
        this.log(`account is not initialized, please send funds to ${wallet.bech32Address} before initiating a transaction.`)
      }
    }

    this.log("initialize complete");
  }

  public async connect(wallet: TradeHubWallet): Promise<ConnectedTradeHubSDK> {
    await this.initialize(wallet);
    return this as ConnectedTradeHubSDK;
  }

  public async disconnect() {
    await this.wallet?.teardown();
    this.wallet = undefined;
  }

  public async teardown() {
    await this.disconnect();
    this.ws?.disconnect();
  }

  public async connectWithPrivateKey(
    privateKey: string | Buffer,
    opts?: TradeHubWalletGenericOpts,
  ) {
    const wallet = TradeHubWallet.withPrivateKey(privateKey, {
      ...opts,
      debugMode: this.debugMode,
      network: this.network,
      config: this.configOverride,
    })
    return this.connect(wallet)
  }

  public async connectWithMnemonic(
    mnemonic: string,
    opts?: TradeHubWalletGenericOpts,
  ) {
    const wallet = TradeHubWallet.withMnemonic(mnemonic, {
      ...opts,
      debugMode: this.debugMode,
      network: this.network,
      config: this.configOverride,
    })
    return this.connect(wallet)
  }

  public async connectWithSigner(
    signer: TradeHubSigner,
    publicKeyBase64: string,
    opts?: TradeHubWalletGenericOpts,
  ) {
    const wallet = TradeHubWallet.withSigner(signer, publicKeyBase64, {
      ...opts,
      debugMode: this.debugMode,
      network: this.network,
      config: this.configOverride,
    })
    return this.connect(wallet)
  }

  public async connectWithLedger(
    ledger: CosmosLedger,
    opts?: TradeHubWalletGenericOpts,
  ) {
    const publicKeyBase64 = await ledger.getPubKey()

    const wallet = TradeHubWallet.withLedger(ledger, publicKeyBase64, {
      ...opts,
      debugMode: this.debugMode,
      network: this.network,
      config: this.configOverride,
    })
    return this.connect(wallet)
  }

  public getConnectedWallet(): TradeHubWallet {
    return this.checkWallet();
  }

  public async subscribeWallet(handler: WSSubscriber) {
    if (!this.wallet)
      throw new Error("SDK not connected");
    if (!this.ws?.connected)
      await this.startWS();

    await this.ws.subscribe({
      address: this.wallet.bech32Address,
      channel: WSChannel.balances,
    }, handler);
  }

  private checkWallet(): TradeHubWallet {
    if (!this.wallet) {
      throw new Error("wallet not connected");
    }

    return this.wallet;
  }
}

export interface ConnectedTradeHubSDK extends TradeHubSDK {
  wallet: TradeHubWallet
}

namespace TradeHubSDK {
  export import RPCParams = _RPCParams;
  /** @deprecated use RestModels */
  export import RestResponse = _RestModels;
  export import RestModels = _RestModels;
  export import RestTypes = _RestTypes;

  export import Network = _Network;
}

export default TradeHubSDK
