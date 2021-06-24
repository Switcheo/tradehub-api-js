import { Proposal } from "./Proposal";

interface RewardCurveParams {
  start_time: string
  initial_reward_bps: number
  reduction_multiplier_bps: number
  reduction_interval_seconds: string
  reductions: number
  final_reward_bps: number
  originator: string
}

export interface SetRewardCurveProposal extends Proposal {
  msg: RewardCurveParams
}
