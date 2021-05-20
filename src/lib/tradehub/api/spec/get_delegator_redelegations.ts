import { RestResponse } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetDelegatorRedelegationsResponse extends CosmosResponse<Array<RestResponse.Delegation>> {}

export interface GetDelegatorRedelegationsOpts {
    delegator?: string
}