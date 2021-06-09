import { RestModels } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetStakingPoolResponse extends CosmosResponse<RestModels.StakingPoolToken> {}
