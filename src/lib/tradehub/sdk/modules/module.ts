import { APIClient } from "@lib/tradehub/api";
import { TradeHubWallet } from "@lib/tradehub/wallet";

export interface SDKProvider {
  api: APIClient;
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
    this.sdkProvider.log(args)
  }
}

export default BaseModule;
