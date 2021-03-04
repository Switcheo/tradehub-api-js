import { Account } from "@lib/models";
import { CosmosResponse, TypedResponse } from "./util";

export interface GetAccountResponse extends CosmosResponse<TypedResponse<Account>> { }
export interface GetAccountOpts {
  address?: string
}
