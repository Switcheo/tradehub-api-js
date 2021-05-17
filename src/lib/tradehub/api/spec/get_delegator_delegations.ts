import { RestResponse } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetDelegatorDelegationsResponse extends CosmosResponse<Array<RestResponse.Delegation>> {}

export interface GetDelegatorDelegationsOpts {
    address: string
}