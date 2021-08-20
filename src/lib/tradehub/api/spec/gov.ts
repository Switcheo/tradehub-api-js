import { RestModels } from "@lib/tradehub/models";
import { CosmosResponse } from "./util";

export interface GovDepositParamsResponse extends CosmosResponse<RestModels.GovDepositParams> {}
export interface GovTallyParamsResponse extends CosmosResponse<RestModels.GovTallyParams> {}
export interface GovListProposalResponse extends CosmosResponse<RestModels.GovProposal[]> {}
export interface GovGetProposalResponse extends CosmosResponse<RestModels.GovProposal> {}
export interface GovProposerResponse extends CosmosResponse<RestModels.GovProposer> {}
export interface GovLiveTallyResponse extends CosmosResponse<RestModels.GovProposalTally> {}

export interface ListGovProposalOpts {
  limit?: number
  page?: number
}

export interface GetGovProposalOpts {
  proposalId: number
}
