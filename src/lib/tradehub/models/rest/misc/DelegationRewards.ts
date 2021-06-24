import { TokenAmount } from "@lib/models";

export interface DelegationRewards {
    rewards: ValidatorReward[] | null
    total: TokenAmount[]
}

export interface ValidatorReward {
    validator_address: string
    reward: TokenAmount[] | null
}
