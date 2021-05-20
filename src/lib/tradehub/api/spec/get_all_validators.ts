import { RestResponse } from "@lib/tradehub/models";

export interface GetAllValidatorsResponse extends Array<RestResponse.AllValidators[]> {}