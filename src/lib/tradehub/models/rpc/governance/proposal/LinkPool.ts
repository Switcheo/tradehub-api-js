import { Proposal } from "./Proposal";

interface LinkPoolParams {
  pool_id: string
  market: string
  originator: string
}

export interface LinkPoolProposal extends Proposal {
  msg: LinkPoolParams
}
