import { Network } from "../types";


export interface TradeHubSDKInitOpts {
  network?: Network,
}

const DEFAULT_OPTS: TradeHubSDKInitOpts = {
  network: Network.MainNet,
}

export class TradeHubSDK {
  network: Network

  constructor(opts: TradeHubSDKInitOpts = DEFAULT_OPTS) {
    this.network = opts.network
  }
}
