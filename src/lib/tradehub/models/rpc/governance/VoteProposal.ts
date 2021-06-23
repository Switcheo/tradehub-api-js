import { TxMsgValue } from "@lib/tradehub/utils";

export interface VoteProposalMsg extends TxMsgValue {
  proposal_id: string
  voter: string
  option: string
}
