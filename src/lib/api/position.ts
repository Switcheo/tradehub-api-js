import * as types from '../types'
import { WalletClient, SignMessageOptions }  from '../clients/wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions { }

export interface EditMarginMsg {
    market: string,
    margin: string,
    originator?: string,
}

export async function editMargin(wallet: WalletClient, params: EditMarginMsg, options?: Options) {
    return editMargins(wallet, [params], options)
}

export async function editMargins(wallet: WalletClient, msgs: EditMarginMsg[], options?: Options) {
    msgs = msgs.map(msg => {
        if (!msg.originator) msg.originator = wallet.pubKeyBech32
        return msg
    })
    return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.EDIT_MARGIN_MSG_TYPE), options)
}
