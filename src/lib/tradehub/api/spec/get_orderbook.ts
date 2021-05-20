import { RestResponse } from "@lib/tradehub/models";

export interface GetOrderbookResponse extends RestResponse.OrderBook {}

/**
 * @param market The market (eg: swth_eth)
 */

export interface GetOrderbookOpts {
  market?: string
}
