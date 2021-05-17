import { RestResponse } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetStakingPoolResponse extends CosmosResponse<RestResponse.StakingPoolToken> {}