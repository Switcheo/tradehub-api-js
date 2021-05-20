export interface StakingValidators {
    operator_address: string
    consensus_pubkey: string
    jailed: boolean
    status: number
    tokens: string
    delegator_shares: string
    description: ValidatorDescription
    unbonding_height: string
    unbonding_time: string
    commission: ValidatorCommission
    min_self_delegation: string
}

interface ValidatorDescription {
    moniker: string
    identity: string
    website: string
    security_contact: string
    details: string
}

interface ValidatorCommission {
    commission_rates: CommissionRate
    update_time: string
}

interface CommissionRate {
    rate: string
    max_rate: string
    max_change_rate: string
}