import { Proposal } from "./Proposal";

interface OracleParams {
  id: string
  description: string
  min_turnout_percentage: string
  max_result_age: string
  security_type: string
  result_strategy: string
  resolution: string
  spec: string
  originator: string
}

export interface CreateOracleProposal extends Proposal {
  oracle: OracleParams
}
