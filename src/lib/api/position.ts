import * as types from '../types'
import { Wallet, SignMessageOptions } from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions { }

export interface EditMarginMsg {
    market: string,
    margin: string,
    originator?: string,
}

export async function editMargin(wallet: Wallet, params: EditMarginMsg, options?: Options) {
    return editMargins(wallet, [params], options)
}

export async function editMargins(wallet: Wallet, msgs: EditMarginMsg[], options?: Options) {
    msgs = msgs.map(msg => {
        if (!msg.originator) msg.originator = wallet.pubKeyBech32
        return msg
    })
    return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.EDIT_MARGIN_MSG_TYPE), options)
}
