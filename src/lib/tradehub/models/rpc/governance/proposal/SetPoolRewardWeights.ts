import { Proposal } from "./Proposal";

export interface PoolRewardWeight {
  pool_id: string
  weight: string
}

interface PoolRewardWeights extends Array<PoolRewardWeight> { }

interface PoolRewardWeightsParams {
  weights: PoolRewardWeights
  originator: string
}

export interface SetPoolRewardWeightsProposal extends Proposal {
  msg: PoolRewardWeightsParams
}
