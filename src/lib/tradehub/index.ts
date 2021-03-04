import { Network } from "../types";
import APIClient from "./APIClient";

export interface TradeHubSDKInitOpts {
  network?: Network
  debugMode?: boolean
}

const DEFAULT_OPTS: TradeHubSDKInitOpts = {
  network: Network.MainNet,
}

class TradeHubSDK {
  network: Network
  api: APIClient
  debugMode: boolean

  constructor(opts: TradeHubSDKInitOpts = DEFAULT_OPTS) {
    this.network = opts.network
    this.api = new APIClient(this.network)
    this.debugMode = opts.debugMode ?? false
  }
}

export default TradeHubSDK
