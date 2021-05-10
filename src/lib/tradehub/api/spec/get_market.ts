import { RestResponse } from "@lib/tradehub/models";

export interface GetMarketResponse extends RestResponse.Market {}

/**
 * @param market The market (eg: swth_eth)
 */

export interface GetMarketOpts {
  market: string
}
