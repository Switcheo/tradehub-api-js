import { RestResponse } from "@lib/tradehub/models";

export interface GetPositionResponse extends RestResponse.Position { }

/**
 * @param account TradeHub address to query
 * @param market TradeHub market eg. 'swth_eth'
 */
export interface GetPositionOpts {
  account: string
  market: string
}

export interface GetPositionsOpts {
  account: string
}
