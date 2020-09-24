import * as types from '../types'
import { WalletClient, SignMessageOptions }  from '../clients/wallet'
import { TransactionOptions } from '../containers/Transaction'
import { getNetwork } from '../../lib/config'
import fetch from '../../lib/utils/fetch'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface CreatePoolMsg {
  token_a_denom?: string,
  token_b_denom?: string,
  token_a_weight?: string,
  token_b_weight?: string,
  originator?: string,
}

export interface CreatePoolWithLiquidityMsg extends CreatePoolMsg {
  a_amount?: string
  a_max_amount?: string
  b_amount?: string
  b_max_amount?: string
}

export interface LinkPoolMsg {
  pool_id: string,
  market: string,
  strategy: string,
  originator?: string,
}

export interface UnlinkPoolMsg {
  pool_id: string,
  originator?: string,
}

export interface AddLiquidityMsg {
  pool_id: string
  a_denom?: string
  a_amount?: string
  a_max_amount?: string
  b_denom?: string
  b_amount?: string
  b_max_amount?: string
  originator?: string
}

export interface RemoveLiquidityMsg {
  pool_id: string,
  shares: string,
  originator?: string,
}

export async function addLiquidity(wallet: WalletClient, msg: AddLiquidityMsg, options?: Options) {
	if(!msg.originator) {
    msg.originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.ADD_LIQUIDITY_MSG_TYPE], options)
}

export async function removeLiquidity(wallet: WalletClient, msg: RemoveLiquidityMsg, options?: Options) {
  if(!msg.originator) {
    msg.originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.REMOVE_LIQUIDITY_MSG_TYPE], options)
}

export async function createPool(wallet: WalletClient, msg: CreatePoolMsg, options?: Options) {
  if(!msg.originator) {
    msg.originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.CREATE_POOL_MSG_TYPE], options)
}

export async function createPoolWithLiquidity(wallet: WalletClient, msg: CreatePoolWithLiquidityMsg, options?: Options) {
  if(!msg.originator) {
    msg.originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.CREATE_POOL_WITH_LIQUIDITY_MSG_TYPE], options)
}

export async function linkPool(wallet: WalletClient, msg: LinkPoolMsg, options?: Options) {
  if(!msg.originator) {
    msg.originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.LINK_POOL_MSG_TYPE], options)
}
export async function unlinkPool(wallet: WalletClient, msg: UnlinkPoolMsg, options?: Options) {
  if(!msg.originator) {
    msg.originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.UNLINK_POOL_MSG_TYPE], options)
}

// getLiquidityPools
export async function getLiquidityPools(net: string): Promise<any> {
  const network = getNetwork(net)
  return fetch(`${network.REST_URL}/get_liquidity_pools`)
    .then(res => res.json()) // expecting a json response
}
