import { Order } from "@lib/models";

export interface GetOrderResponse extends Order { }

/**
 * @param order_id Unique identifier of the order object
 */
export interface GetOrderOpts {
  order_id: string
}
