import { RestModels } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GetRewardHistoryResponse extends CosmosResponse<RestModels.RewardHistory[]> {}

export interface GetRewardHistoryOpts {
  poolId: string
  blockHeight: string
}
