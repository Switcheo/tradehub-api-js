export interface AllValidators {
    OperatorAddress: string
    ConsPubKey: string
    Jailed: boolean
    Status: number
    Tokens: string
    DelegatorShares: string
    Description: ValidatorDescription
    UnbondingHeight: number
    UnbondingCompletionTime: string
    Commission: ValidatorCommission
    MinSelfDelegation: string
    ConsAddress: string
    ConsAddressByte: string
    WalletAddress: string
    BondStatus: string
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