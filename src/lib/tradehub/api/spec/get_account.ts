import { RestModels } from "@lib/tradehub/models";
import { CosmosResponse, TypedResponse } from "./util";

export interface GetAccountResponse extends CosmosResponse<TypedResponse<RestModels.Account>> { }

/**
 * @param address TradeHub address to query
 */
export interface GetAccountOpts {
  address: string
}
