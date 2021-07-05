import { TxMsgValue } from "@lib/tradehub/utils";

export interface SetTradingFlag extends TxMsgValue {
    is_enabled: boolean
    blockchain: string
    originator?: string
}