import { RestModels } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetDelegatorDelegationRewardsResponse extends CosmosResponse<RestModels.DelegationRewards> {}

export interface GetDelegatorDelegationRewardsOpts {
    address: string
}
