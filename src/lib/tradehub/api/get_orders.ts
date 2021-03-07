import { Order } from "@lib/models";

export interface GetOrdersResponse extends Order { }

/**
 * @param order_id Order id to query
 */
export interface GetOrderOpts {
  account: string
  market: string
  limit: string
  beforeId: string
  afterId: string
  orderStatus: string
  orderType: string
}
