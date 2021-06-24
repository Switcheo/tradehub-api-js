import { RestModels } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetStakingValidatorsResponse extends CosmosResponse<Array<RestModels.StakingValidators>> {}
