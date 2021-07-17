import BigNumber from "bignumber.js";
import dayjs from "dayjs";

export interface Delegation {
    delegator_address: string
    validator_src_address: string
    validator_dst_address: string
    entries: DelegationEntry[]
}

export interface DelegationEntry {
    creation_height: number
    completion_time: dayjs.Dayjs
    initial_balance: BigNumber
    shares_dst: BigNumber
    balance: BigNumber
}

export interface DelegatorUnbonding {
    delegator_address: string
    validator_address: string
    entries: UnbondingEntry[]
}

export interface UnbondingEntry {
    creation_height: number
    completion_time: dayjs.Dayjs
    initial_balance: BigNumber
    balance: BigNumber
}
