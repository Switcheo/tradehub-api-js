import { RestModels } from "@lib/tradehub/models";

export interface GetOrderResponse extends RestModels.Order { }

/**
 * @param order_id Unique identifier of the order object
 */
export interface GetOrderOpts {
  order_id: string
}
