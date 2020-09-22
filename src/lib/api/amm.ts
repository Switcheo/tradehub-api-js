import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'
import { getNetwork } from '../../lib/config'
import fetch from '../../lib/utils/fetch'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface CreatePoolMsg {
  TokenADenom?: string,
  TokenBDenom?: string,
  Originator?: string,
}

export interface LinkPoolMsg {
  PoolID: string,
  Market: string,
  Strategy: string,
  Originator?: string,
}

export interface UnlinkPoolMsg {
  PoolID: string,
  Originator?: string,
}

export interface AddLiquidityMsg {
  PoolID: string,
  ADenom?: string,
  AAmount?: string,
  AMaxAmount?: string,
  BDenom?: string,
  BAmount?: string,
  BMaxAmount?: string,
  Originator?: string,
}

export interface RemoveLiquidityMsg {
  PoolID: string,
  Shares: string,
  Originator?: string,
}

export async function addLiquidity(wallet: Wallet, msg: AddLiquidityMsg, options?: Options) {
	if(!msg.Originator) {
    msg.Originator = wallet.pubKeyBech32
  }
  if (!msg.ADenom) {
    msg.ADenom = ''
  }
  if (!msg.AAmount) {
    msg.AAmount = ''
  }
  if (!msg.AMaxAmount) {
    msg.AMaxAmount = ''
  }
  if (!msg.BDenom) {
    msg.BDenom = ''
  }
  if (!msg.BAmount) {
    msg.BAmount = ''
  }
  if (!msg.BMaxAmount) {
    msg.BMaxAmount = ''
  }
  return wallet.signAndBroadcast([msg], [types.ADD_LIQUIDITY_MSG_TYPE], options)
}

export async function removeLiquidity(wallet: Wallet, msg: RemoveLiquidityMsg, options?: Options) {
	if(!msg.Originator) {
    msg.Originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.REMOVE_LIQUIDITY_MSG_TYPE], options)
}
export async function createPool(wallet: Wallet, msg: CreatePoolMsg, options?: Options) {
  if (!msg.TokenADenom) {
    msg.TokenADenom = ''
  }
  if (!msg.TokenBDenom) {
    msg.TokenBDenom = ''
  }
	if(!msg.Originator) {
    msg.Originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.CREATE_POOL_MSG_TYPE], options)
}

export async function linkPool(wallet: Wallet, msg: LinkPoolMsg, options?: Options) {
	if(!msg.Originator) {
    msg.Originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.LINK_POOL_MSG_TYPE], options)
}
export async function unlinkPool(wallet: Wallet, msg: UnlinkPoolMsg, options?: Options) {
	if(!msg.Originator) {
    msg.Originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.UNLINK_POOL_MSG_TYPE], options)
}

// getLiquidityPools
export async function getLiquidityPools(net: string): Promise<any> {
  const network = getNetwork(net)
  return fetch(`${network.REST_URL}/get_liquidity_pools`)
    .then(res => res.json()) // expecting a json response
}
