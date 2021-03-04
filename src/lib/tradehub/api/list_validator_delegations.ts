import { Delegation } from "@tradehub/models";
import { CosmosResponse } from "./util";

export interface ListValidatorDelegationsResponse extends CosmosResponse<Delegation[]> { }
export interface ListValidatorDelegationsOpts {
  validator: string
}
