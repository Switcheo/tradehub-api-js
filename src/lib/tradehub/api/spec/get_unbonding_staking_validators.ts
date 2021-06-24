import { RestModels } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetUnbondingStakingValidatorsResponse extends CosmosResponse<Array<RestModels.StakingValidators>> {}
