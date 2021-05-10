import { Delegation } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface ListValidatorDelegationsResponse extends CosmosResponse<Delegation[]> { }

/**
 * @param validator TradeHub validator address to query (starts with `swthvaloper…`)
 */
export interface ListValidatorDelegationsOpts {
  validator: string
}
