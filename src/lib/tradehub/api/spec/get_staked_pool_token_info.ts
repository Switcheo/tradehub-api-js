import { RestResponse } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetStakedPoolTokenResponse extends CosmosResponse<RestResponse.PoolToken> {}

export interface GetStakedPoolTokenOpts {
    pool_id: number
    account: string
}