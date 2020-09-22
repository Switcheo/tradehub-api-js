import * as types from '../types'
import { Wallet, SignMessageOptions } from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions { }

export interface SetLeverageMsg {
  market: string,
  leverage: string,
  originator?: string,
}

export async function setLeverage(wallet: Wallet, msg: SetLeverageMsg, options?: Options) {
  return setLeverages(wallet, [msg], options)
}

export async function setLeverages(wallet: Wallet, msgs: SetLeverageMsg[], options?: Options) {
  msgs = msgs.map(msg => {
    if (!msg.originator) msg.originator = wallet.pubKeyBech32
    return msg
  })
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.SET_LEVERAGE_MSG_TYPE), options)
}
