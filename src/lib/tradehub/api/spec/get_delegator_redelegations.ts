import { RestModels } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetDelegatorRedelegationsResponse extends CosmosResponse<Array<RestModels.Delegation>> {}

export interface GetDelegatorRedelegationsOpts {
    delegator?: string
}
