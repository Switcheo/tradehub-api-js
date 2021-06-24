export interface Delegation {
    delegator_address: string
    validator_src_address: string
    validator_dst_address: string
    entries: Array<DelegationEntry>
}

export interface UnbondingDelegation {
    delegator_address: string
    validator_address: string
    entries: Array<DelegationEntry>
}

interface DelegationEntry {
    creation_height: number
    completion_time: string
    initial_balance: string
    shares_dst: string
    balance: string
}