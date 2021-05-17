import { RestResponse } from "@lib/tradehub/models";

export interface GetPricesResponse extends RestResponse.Price {}

/**
 * @param market The market (eg: swth_eth)
 */
export interface GetPricesOpts {
  market?: string
}
