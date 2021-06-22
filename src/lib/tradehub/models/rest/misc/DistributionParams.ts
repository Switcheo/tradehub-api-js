import BigNumber from "bignumber.js";

export interface DistributionParams {
    community_tax: BigNumber
    base_proposer_reward: BigNumber
    bonus_proposer_reward: BigNumber
    liquidity_provider_reward: BigNumber
    withdraw_addr_enabled: boolean
}
