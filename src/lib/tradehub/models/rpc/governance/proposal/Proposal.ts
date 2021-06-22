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

export namespace Proposal {
  export enum Type {
    CreateToken = "coin/TokenProposal",
    CreateOracle = "oracle/OracleProposal",
    CreateMarket = "market/MarketProposal",
    UpdateMarket = "market/UpdateMarketProposal",
    LinkPool = "liquiditypool/LinkPoolProposal",
    UnlinkPool = "liquiditypool/UnlinkPoolProposal",
    SetPoolRewardWeights = "liquiditypool/SetRewardsWeightsProposal",
    SetRewardCurve = "liquiditypool/SetRewardCurveProposal",
    SetCommitmentCurve = "liquiditypool/SetCommitmentCurveProposal",
    SetSettlementPrice = "pricing/SettlementPriceProposal",
    CommunityPoolSpend = "cosmos-sdk/CommunityPoolSpendProposal",
    ParameterChange = "cosmos-sdk/ParameterChangeProposal",
    SoftwareUpgrade = "cosmos-sdk/SoftwareUpgradeProposal",
    CancelSoftwareUpgrade = "cosmos-sdk/CancelSoftwareUpgradeProposal",
    Text = "cosmos-sdk/TextProposal",
  }
}
