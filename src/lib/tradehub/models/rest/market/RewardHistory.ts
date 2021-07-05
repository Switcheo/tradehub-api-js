import { TokenAmount } from "../token";

export interface RewardHistory {
  BlockHeight: string
  Rewards: TokenAmount[] | null
  TotalCommitment: string
}
