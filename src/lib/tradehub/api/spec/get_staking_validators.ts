import { RestResponse } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetStakingValidatorsResponse extends CosmosResponse<Array<RestResponse.StakingValidators>> {}