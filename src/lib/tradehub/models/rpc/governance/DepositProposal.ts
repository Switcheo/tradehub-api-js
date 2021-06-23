import { TokenAmount } from "@lib/tradehub/models/rest";
import { TxMsgValue } from "@lib/tradehub/utils";

export interface DepositProposalMsg extends TxMsgValue {
  proposal_id: string
  depositor: string
  amount: TokenAmount[]
}
