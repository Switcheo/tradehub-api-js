import { RestModels } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface ListValidatorDelegationsResponse extends CosmosResponse<RestModels.ValidatorDelegation[]> { }

/**
 * @param validator TradeHub validator address to query (starts with `swthvaloper…`)
 */
export interface ListValidatorDelegationsOpts {
  validator: string
}
