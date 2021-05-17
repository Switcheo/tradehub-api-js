import { GetDelegatorDelegationsResponse } from "./get_delegator_delegations";
import { GetDelegatorUnbondingDelegationsResponse } from "./get_delegator_unbonding_delegations";
import {GetDelegatorRedelegationsResponse} from "./get_delegator_redelegations"

export interface GetAllDelegatorDelegationsResponse {
    delegations: GetDelegatorDelegationsResponse
    unbonding: GetDelegatorUnbondingDelegationsResponse
    redelegations: GetDelegatorRedelegationsResponse
}

export interface GetAllDelegatorDelegationsOpts {
    address: string
    delegator?: string
}