import { Account } from "@lib/models";
import { CosmosResponse, TypedResponse } from "./util";

export interface GetAccountResponse extends CosmosResponse<TypedResponse<Account>> { }

/**
 * @param address TradeHub address to query
 */
export interface GetAccountOpts {
  address?: string
}
