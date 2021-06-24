import { RestModels } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetStakedPoolTokenResponse extends CosmosResponse<RestModels.PoolToken> {}

export interface GetStakedPoolTokenOpts {
    pool_id: number
    account: string
}
