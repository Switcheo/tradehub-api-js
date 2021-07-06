import { TxMsgValue } from "@lib/tradehub/utils";

export interface SetLeverage extends TxMsgValue {
    market: string,
    leverage: string,
    originator?: string,
}