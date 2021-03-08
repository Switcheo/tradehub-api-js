import { OrderBook } from "@lib/models";

export interface GetOrderBookResponse extends OrderBook {}

/**
 * @param market The market (eg: swth_eth)
 */

export interface GetOrderbookOpts {
  market: string
}