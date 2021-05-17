import { RestResponse } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetUnbondedStakingValidatorsResponse extends CosmosResponse<Array<RestResponse.StakingValidators>> {}