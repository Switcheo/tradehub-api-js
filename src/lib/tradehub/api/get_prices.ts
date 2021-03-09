import { Price } from "@lib/tradehub/models";

export interface GetPricesResponse extends Price {}

/**
 * @param market The market (eg: swth_eth)
 */
export interface GetPricesOpts {
  market: string
}