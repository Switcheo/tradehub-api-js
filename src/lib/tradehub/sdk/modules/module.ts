import { APIClient } from "@lib/tradehub/api";
import { NetworkConfig, TxMsgValue } from "@lib/tradehub/utils";
import { TradeHubWallet } from "@lib/tradehub/wallet";

export interface SDKProvider {
  api: APIClient;
  networkConfig: NetworkConfig;
  log: (...args: any[]) => void;
  getConnectedWallet: () => TradeHubWallet;
}

class BaseModule {
  constructor(
    public readonly sdkProvider: SDKProvider,
  ) { }

  protected getWallet(): TradeHubWallet {
    return this.sdkProvider.getConnectedWallet();
  }

  protected log(...args: any[]): void {
    this.sdkProvider.log(`[${this.constructor.name}]`, ...args);
  }

  protected async sendTx(msgType: string, params: TxMsgValue): Promise<unknown> {
    const wallet = this.getWallet();

    return await wallet.sendTx({
      type: msgType,
      value: params,
    });
  }
}

export default BaseModule;
