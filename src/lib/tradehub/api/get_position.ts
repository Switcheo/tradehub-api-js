import { Position } from "@lib/models/position";

export interface GetPositionResponse extends Position { }

/**
 * @param account TradeHub address to query
 * @param market TradeHub market eg. 'swth_eth'
 */
export interface GetPositionOpts {
  account: string
  market: string
}
