import { RestModels } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetDelegatorUnbondingDelegationsResponse extends CosmosResponse<RestModels.DelegatorUnbonding[]> {}

export interface GetDelegatorUnbondingDelegationsOpts {
    address: string
}
