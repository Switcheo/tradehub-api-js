import { TokenAmount } from "@lib/models";

export interface DelegationRewards {
    rewards: Array<ValidatorReward>
    total: Array<TokenAmount>
}

interface ValidatorReward {
    validator_address: string
    reward: Array<TokenAmount>
}