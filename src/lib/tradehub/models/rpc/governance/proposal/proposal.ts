import { TokenAmount } from "@lib/tradehub/models/rest";
import { TxMsgValue } from "@lib/tradehub/utils";

export interface Proposal {
  title: string
  description: string
}

export interface SubmitProposalMsg<T = Proposal> extends TxMsgValue {
  content: {
    type: string
    value: T
  }
  initial_deposit: TokenAmount[]
  proposer: string
}
