import { TxMsgValue } from "@lib/tradehub/utils";

export interface CancelAll extends TxMsgValue {
    market: string,
    originator?: string,
}