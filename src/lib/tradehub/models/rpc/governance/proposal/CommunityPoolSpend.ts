import { TokenAmount } from "@lib/tradehub/models/rest";
import { Proposal } from "./Proposal";

export interface CommunityPoolSpendProposal extends Proposal {
  title: string
  description: string
  recipient: string
  amount: TokenAmount[]
}
