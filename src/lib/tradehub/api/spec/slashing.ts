import { RestModels } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetSlashingParamsResponse extends CosmosResponse<RestModels.SlashingParams> {}
export interface GetSlashingSigningInfoResponse extends CosmosResponse<RestModels.SlashingSigningInfo[]> {}
