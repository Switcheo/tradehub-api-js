import { RestModels } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetDelegatorDelegationsResponse extends CosmosResponse<Array<RestModels.Delegation>> {}

export interface GetDelegatorDelegationsOpts {
    address: string
}
