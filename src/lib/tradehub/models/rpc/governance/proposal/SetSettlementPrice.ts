import { Proposal } from "./Proposal";

export interface SetSettlementPriceProposal extends Proposal {
  market: string
  settlement_price: string
}
