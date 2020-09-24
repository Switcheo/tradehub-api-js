import * as types from '../types'
import { WalletClient, SignMessageOptions }  from '../clients/wallet'
import { TransactionOptions } from '../containers/Transaction'
import { getNetwork } from '../config'
import fetch from '../utils/fetch'

interface Options extends SignMessageOptions, TransactionOptions {
}

export interface DelegateTokensMsg {
  delegator_address: string,
  validator_address: string,
  amount: {
    amount: string,
    denom: string,
  },
}

export interface BeginUnbondingTokensMsg {
  delegator_address: string,
  validator_address: string,
  amount: {
    amount: string,
    denom: string,
  },
}

export interface BeginRedelegatingTokensMsg {
  delegator_address: string,
  validator_src_address: string,
  validator_dst_address: string,
  amount: {
    amount: string,
    denom: string,
  },
}

export interface WithdrawDelegatorRewardsMsg {
  delegator_address: string,
  validator_address: string,
}

export interface WithdrawAllDelegatorRewardsParams {
  delegatorAddress: string,
  validatorAddresses: string[],
}

export interface CreateValidatorMsg {
  description: {
    moniker: string,
    identity: string,
    website: string,
    details: string,
  },
  commission: {
    rate: string,
    max_rate: string,
    max_rate_change: string,
  },
  min_self_delegation: string,
  delegator_address: string,
  validator_address: string,
  pubkey: string,
  value: {
    amount: string,
    denom: string,
  },
}

export interface AddressOnlyGetterParams {
  address: string
}

// * Transaction requests * //

export async function createValidator(wallet: WalletClient, msg: CreateValidatorMsg, options?: Options) {
  return wallet.signAndBroadcast([msg], [types.CREATE_VALIDATOR_MSG_TYPE], options)
}

export async function delegateTokens(wallet: WalletClient, msg: DelegateTokensMsg, options?: Options) {
  return wallet.signAndBroadcast([msg], [types.DELEGATE_TOKENS_MSG_TYPE], options)
}

export async function unbondTokens(wallet: WalletClient,
                                   msg: BeginUnbondingTokensMsg, options?: Options) {
  return wallet.signAndBroadcast([msg], [types.BEGIN_UNBONDING_TOKENS_MSG_TYPE], options)
}

export async function redelegateTokens(wallet: WalletClient,
                                       msg: BeginRedelegatingTokensMsg, options?: Options) {
  return wallet.signAndBroadcast([msg],
    [types.BEGIN_REDELEGATING_TOKENS_MSG_TYPE], options)
}

export async function withdrawDelegatorRewards(wallet: WalletClient,
                                               msg: WithdrawDelegatorRewardsMsg,
                                               options?: Options) {
  return wallet.signAndBroadcast([msg],
    [types.WITHDRAW_DELEGATOR_REWARDS_MSG_TYPE], options)
}

export async function withdrawAllDelegatorRewards(wallet: WalletClient,
                                                  msg: WithdrawAllDelegatorRewardsParams,
                                                  options?: Options) {
  const { validatorAddresses, delegatorAddress } = msg
  const messages: Array<WithdrawDelegatorRewardsMsg> =
    validatorAddresses.map((address: string) => (
      { validator_address: address, delegator_address: delegatorAddress }
    ))
  return wallet.signAndBroadcast(messages,
    Array(validatorAddresses.length).fill(types.WITHDRAW_DELEGATOR_REWARDS_MSG_TYPE), options)
}

// * Get requests * //


// /staking/validators
export async function getStakingValidators(net: string): Promise<any> {
  const network = getNetwork(net)
  return fetch(`${network.COSMOS_URL}/staking/validators`)
    .then(res => res.json()) // expecting a json response
}

export async function getUnbondingStakingValidators(net: string): Promise<any> {
  const network = getNetwork(net)
  return fetch(`${network.COSMOS_URL}/staking/validators?status=unbonding`)
    .then(res => res.json()) // expecting a json response
}

export async function getUnbondedStakingValidators(net: string): Promise<any> {
  const network = getNetwork(net)
  return fetch(`${network.COSMOS_URL}/staking/validators?status=unbonded`)
    .then(res => res.json()) // expecting a json response
}

// /staking/validators
export async function getStakingPool(net: string): Promise<any> {
  const network = getNetwork(net)
  return fetch(`${network.COSMOS_URL}/staking/pool`)
    .then(res => res.json()) // expecting a json response
}

// /staking/validators/{address}/delegations
export async function getValidatorDelegations(net: string,
                                              params: AddressOnlyGetterParams): Promise<any> {
  const network = getNetwork(net)
  const { address } = params
  return fetch(`${network.COSMOS_URL}/staking/validators/${address}/delegations`)
    .then(res => res.json()) // expecting a json response
}

// /staking/delegators/{address}/delegations
export async function getDelegatorDelegations(net: string,
                                              params: AddressOnlyGetterParams): Promise<any> {
  const network = getNetwork(net)
  const { address } = params
  return fetch(`${network.COSMOS_URL}/staking/delegators/${address}/delegations`)
    .then(res => res.json()) // expecting a json response
}

// /staking/delegators/{address}/unbonding_delegations
export async function getDelegatorUnbondingDelegations(net: string,
                                                       params: AddressOnlyGetterParams): Promise<any> {
  const network = getNetwork(net)
  const { address } = params
  return fetch(`${network.COSMOS_URL}/staking/delegators/${address}/unbonding_delegations`)
    .then(res => res.json()) // expecting a json response
}

// /staking/delegators/{address}/redelegations
export async function getDelegatorRedelegations(net: string,
                                                params: AddressOnlyGetterParams): Promise<any> {
  const network = getNetwork(net)
  const { address } = params
  return fetch(`${network.COSMOS_URL}/staking/redelegations?delegator=${address}`)
    .then(res => res.json()) // expecting a json response
}

// function to query 3 types of delegation at once
export async function getAllDelegatorDelegations(net: string,
                                                 params: AddressOnlyGetterParams): Promise<any> {
  const promises = [
    getDelegatorDelegations(net, params),
    getDelegatorUnbondingDelegations(net, params),
    getDelegatorRedelegations(net, params),
  ]
  return Promise.all(promises).then((responses) => {
    return {
      delegations: responses[0],
      unbonding: responses[1],
      redelegations: responses[2],
    }
  })
}

// /distribution/delegators/{address}/rewards
export async function getDelegatorDelegationRewards(net: string,
                                                    params: AddressOnlyGetterParams): Promise<any> {
  const network = getNetwork(net)
  const { address } = params
  return fetch(`${network.COSMOS_URL}/distribution/delegators/${address}/rewards`)
    .then(res => res.json()) // expecting a json response
}
