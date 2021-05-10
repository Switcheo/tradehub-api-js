import { RestResponse } from "@lib/tradehub/models";

export interface GetAccountTradesResponse extends Array<RestResponse.Account> { }

/**
 * @param market The market (eg: swth_eth)
 * @param before_id Only returns trades before this id
 * @param after_id Only returns trades after this id
 * @param order_by Sort trades by
 * @param limit Limit to this number of trades
 * @param account Only returns trades made by this address
 */
export interface GetAccountTradesOpts {
  market: string
  before_id: string
  after_id: string
  order_by: string
  limit: string
  account: string
}
