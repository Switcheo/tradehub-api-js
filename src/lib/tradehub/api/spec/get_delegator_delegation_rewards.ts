import { RestResponse } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetDelegatorDelegationRewardsResponse extends CosmosResponse<RestResponse.DelegationRewards> {}

export interface GetDelegatorDelegationRewardsOpts {
    address: string
}