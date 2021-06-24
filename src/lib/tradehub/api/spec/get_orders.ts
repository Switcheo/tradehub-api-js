import { RestModels } from "@lib/tradehub/models";

export interface GetOrdersResponse extends Array<RestModels.Order> { }

/**
 * @param account Only returns orders made by this address
 * @param market The market (eg: swth_eth)
 * @param limit Limit to this number of orders
 * @param before_id Only returns orders before this id
 * @param after_id Only returns trades after this id
 * @param order_status Status of order
 * @param order_type Type of order
 * @param order_by Sort order by
 * @param initiator Maker of order
 */
export interface GetOrdersOpts {
  account?: string
  market?: string
  limit?: number
  before_id?: string
  after_id?: string
  order_status?: string
  order_type?: string
  order_by?: string
  initiator?: string
}
