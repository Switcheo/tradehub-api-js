import { RestResponse } from "@lib/tradehub/models";
import { CosmosResponse, TypedResponse } from "./util";

export interface GetAccountResponse extends CosmosResponse<TypedResponse<RestResponse.Account>> { }

/**
 * @param address TradeHub address to query
 */
export interface GetAccountOpts {
  address: string
}
