import { RestResponse } from "@lib/tradehub/models";

export interface GetLeverageResponse extends Array<RestResponse.Leverage> { }

/**
 * @param account TradeHub address to query
 */
export interface GetLeverageOpts {
  account: string
}
