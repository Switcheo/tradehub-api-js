import { Proposal } from "./Proposal";

interface CosmosParameter {
  subspace: string
  key: string
  value: string
}

export interface ParameterChangeProposal extends Proposal {
  changes: ReadonlyArray<CosmosParameter>
}
