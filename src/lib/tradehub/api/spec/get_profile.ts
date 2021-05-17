import { RestResponse } from "@lib/tradehub/models";

export interface GetProfileResponse extends RestResponse.Profile { }

/**
 * @param address TradeHub address to query
 */
export interface GetProfileOpts {
  account?: string
}
