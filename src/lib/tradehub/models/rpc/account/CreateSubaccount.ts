import { TxMsgValue } from "@lib/tradehub/utils";

export interface CreateSubAccount extends TxMsgValue {
    sub_address: string,
    originator?: string,
}