import { TokenAmount } from "@lib/models";
import BigNumber from "bignumber.js";
import { Dayjs } from "dayjs";

export interface GovProposalContent {
  type: string,
  value: any
}

export interface GovProposalTally {
  yes: BigNumber
  abstain: BigNumber
  no: BigNumber
  no_with_veto: BigNumber
}

export interface GovProposal {
  content: GovProposalContent
  id: string,
  proposal_status: string,
  final_tally_result: GovProposalTally,
  submit_time: Dayjs,
  deposit_end_time: Dayjs,
  total_deposit: TokenAmount[],
  voting_start_time?: Dayjs
  voting_end_time?: Dayjs
}
