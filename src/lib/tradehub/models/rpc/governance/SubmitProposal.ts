import { TokenAmount } from "@lib/tradehub/models/rest";
import { TxMsgValue } from "@lib/tradehub/utils";
import { Proposal } from "./proposal";

export interface SubmitProposalMsg<T = Proposal> extends TxMsgValue {
  content: {
    type: string
    value: T
  }
  initial_deposit: TokenAmount[]
  proposer: string
}
