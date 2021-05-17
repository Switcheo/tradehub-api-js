import { CosmosResponse } from "./util";

export interface GetDelegatorUnbondingDelegationsResponse extends CosmosResponse<unknown> {}

export interface GetDelegatorUnbondingDelegationsOpts {
    address: string
}