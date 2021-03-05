import { Position } from "@lib/models/position";

export interface GetPositionResponse extends Position { }

/**
 * @param address TradeHub address to query
 */
export interface GetPositionOpts {
  account: string
  market: string
}
