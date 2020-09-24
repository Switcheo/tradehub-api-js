import * as types from '../types'
import { WalletClient, SignMessageOptions }  from '../clients/wallet'
import { TransactionOptions } from '../containers/Transaction'
import { BigNumber } from 'bignumber.js'

interface Options extends SignMessageOptions, TransactionOptions { }

export async function sendTokens(wallet: WalletClient, msg: types.SendTokensMsg, options?: Options) {
  return wallet.signAndBroadcast([msg], [types.SEND_TOKENS_TYPE], options)
}

export interface CreateTokenMsg {
  name: string,
  symbol: string,
  denom: string,
  decimals: string,
  native_decimals: string,
  blockchain: string,
  chain_id: string,
  asset_id: string,
  is_collateral: boolean,
  lock_proxy_hash: string,
  delegated_supply: string,
  originator?: string,
}
export async function createToken(wallet: WalletClient, msg: CreateTokenMsg, options?: Options) {
  return createTokens(wallet, [msg], options)
}

export async function createTokens(wallet: WalletClient, msgs: CreateTokenMsg[], options?: Options) {
  const address = wallet.pubKeyBech32
  msgs = msgs.map(msg => {
    if (!msg.originator) msg.originator = address
    return msg
  })

  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.CREATE_TOKEN_MSG_TYPE), options)
}

export interface MintParams {
  toAddress: string
  mint: Array<{ denom: string, amount: string }>
}

export async function mintMultipleTestnetTokens(minterWallet: WalletClient, params: MintParams) {
  const { toAddress, mint } = params
  const promises = mint.map((v: { denom: string, amount: string }) => {
    return mintTestnetTokens(minterWallet, {
      to_address: toAddress,
      amount: new BigNumber(v.amount).toFixed(18),
      denom: v.denom,
    })
  })
  return Promise.all(promises)
}

export interface MintTokenMsg {
  originator?: string
  to_address: string
  amount: string
  denom: string // max 18 decimal places e.g. 1.000000000000000000
}

export async function mintTestnetTokens(minterWallet: WalletClient, msg: MintTokenMsg, options?: Options) {
  // console.log('minterWallet', minterWallet)
  if (!msg.originator) msg.originator = minterWallet.pubKeyBech32
  console.log('msg', msg)
  return minterWallet.signAndBroadcast([msg], [types.MINT_TOKEN_MSG_TYPE], options)
}
