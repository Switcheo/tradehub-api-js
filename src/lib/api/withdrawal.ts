import * as types from '../types'
import { WalletClient, SignMessageOptions }  from '../clients/wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions { }

export interface CreateWithdrawalMsg {
  to_address: string,
  denom: string,
  amount: string,
  fee_amount: string,
  fee_address: string,
  originator?: string,
}

export async function createWithdrawal(wallet: WalletClient, msg: CreateWithdrawalMsg, options?: Options) {
  if (!msg.originator) msg.originator = wallet.pubKeyBech32
  return wallet.signAndBroadcast([msg], [types.CREATE_WITHDRAWAL_TYPE], options)
}
