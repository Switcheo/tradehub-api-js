import { CosmosResponse } from "./util";

export interface CommitmentCurveInfoResponse {
  max_commitment_duration: string
  max_reward_multiplier: number
}

export interface CommitmentCurveInfo {
  max_commitment_duration: number
  max_reward_multiplier: number
}

export interface GetCommitmentCurveInfoResponse extends CosmosResponse<CommitmentCurveInfoResponse> { }
