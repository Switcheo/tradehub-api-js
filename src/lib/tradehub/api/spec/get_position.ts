/**
 * @param account TradeHub address to query
 * @param market TradeHub market eg. 'swth_eth'
 * @param position_id Unique identifier of the position
 */
export interface GetPositionOpts {
  account?: string
  market?: string
  position_id?: string
}
