import { Order } from "@lib/models";

export interface GetOrderResponse extends Order { }

/**
 * @param order_id Order id to query
 */
export interface GetOrderOpts {
  order_id: string
}
