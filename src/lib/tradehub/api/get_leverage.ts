import { Leverage } from "@lib/models";

export interface GetLeverageResponse extends Leverage { }

/**
 * @param account TradeHub address to query
 */
export interface GetLeverageOpts {
  account: string
}
