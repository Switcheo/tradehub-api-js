import { RestModels } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetUnbondedStakingValidatorsResponse extends CosmosResponse<Array<RestModels.StakingValidators>> {}
