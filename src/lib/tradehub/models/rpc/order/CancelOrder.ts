import { TxMsgValue } from "@lib/tradehub/utils";

export interface CancelOrder extends TxMsgValue {
    id: string,
    originator?: string,
}