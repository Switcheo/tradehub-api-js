export interface Validator {
    OperatorAddress: string
    ConsPubKey: string
    Jailed: boolean
    Status: number
    Tokens: string
    DelegatorShares: string
    Description: ValDescription
    UnbondingHeight: number
    UnbondingCompletionTime: string
    Commission: ValCommission
    MinSelfDelegation: string
    ConsAddress: string
    ConsAddressByte: string
    WalletAddress: string
    BondStatus: string
}

export interface StakingValidators {
    operator_address: string
    consensus_pubkey: string
    jailed: boolean
    status: number
    tokens: string
    delegator_shares: string
    description: ValDescription
    unbonding_height: string
    unbonding_time: string
    commission: ValCommission
    min_self_delegation: string
}

export interface ValDescription {
    moniker: string
    identity: string
    website: string
    security_contact: string
    details: string
}

export interface ValCommission {
    commission_rates: ValCommissionRate
    update_time: string
}

export interface ValCommissionRate {
    rate: string
    max_rate: string
    max_change_rate: string
}
