import { Leverage } from "@lib/tradehub/models";

export interface GetLeverageResponse extends Leverage { }

/**
 * @param account TradeHub address to query
 */
export interface GetLeverageOpts {
  account: string
}
