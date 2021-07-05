import { TxMsgValue } from "@lib/tradehub/utils";

export interface SetMsgFee extends TxMsgValue {
    msg_type: string,
    fee: string,
    originator?: string,
}