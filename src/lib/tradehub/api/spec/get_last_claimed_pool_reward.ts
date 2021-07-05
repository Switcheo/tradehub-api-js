import { CosmosResponse } from "./util";

export interface GetLastClaimedPoolRewardResponse extends CosmosResponse<string> {}

export interface GetLastClaimedPoolRewardOpts {
  poolId: string
  address: string
}
