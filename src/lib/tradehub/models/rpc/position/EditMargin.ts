import { TxMsgValue } from "@lib/tradehub/utils";

export interface EditMargin extends TxMsgValue {
    market: string,
    margin: string,
    originator?: string,
}