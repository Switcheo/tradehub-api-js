import { Market } from "@lib/models";

export interface GetMarketResponse extends Market {}

/**
 * @param market The market (eg: swth_eth)
 */

export interface GetMarketOpts {
  market: string
}