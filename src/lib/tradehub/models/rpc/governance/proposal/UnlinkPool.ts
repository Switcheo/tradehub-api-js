import { Proposal } from "./Proposal";

interface UnlinkPoolParams {
  pool_id: string
  originator: string
}

export interface UnlinkPoolProposal extends Proposal {
  msg: UnlinkPoolParams
}
