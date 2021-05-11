import { RestResponse } from "@lib/tradehub/models";

export interface GetOrderResponse extends Array<RestResponse.Order> { }

/**
 * @param order_id Unique identifier of the order object
 */
export interface GetOrderOpts {
  order_id: string
}
