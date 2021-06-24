import { Proposal } from "./Proposal";

interface CommitmentCurveParams {
  max_duration: string
  max_reward_multiplier: number
  originator: string
}

export interface SetCommitmentCurveProposal extends Proposal {
  msg: CommitmentCurveParams
}
