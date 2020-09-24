import * as types from '../types'
import { WalletClient, SignMessageOptions }  from '../clients/wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions { }

export interface CreateSubAccountMsg {
  sub_address: string,
  originator?: string,
}

export interface ActivateSubAccountMsg {
  expected_main_account: string,
  originator?: string,
}

export async function createSubAccount(wallet: WalletClient, msg: CreateSubAccountMsg, options?: Options) {
  if (!msg.originator) msg.originator = wallet.pubKeyBech32
  return wallet.signAndBroadcast([msg], [types.CREATE_SUB_ACCOUNT_MSG_TYPE], options)
}

export async function activateSubAccount(wallet: WalletClient, msg: ActivateSubAccountMsg, options?: Options) {
  if (!msg.originator) msg.originator = wallet.pubKeyBech32
  return wallet.signAndBroadcast([msg], [types.ACTIVATE_SUB_ACCOUNT_MSG_TYPE], options)
}
