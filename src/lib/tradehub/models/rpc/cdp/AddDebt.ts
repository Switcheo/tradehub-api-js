import { TxMsgValue } from "@lib/tradehub/utils";

export interface AddDebt extends TxMsgValue {
    vault_type_id: string
    amount: string
    originator?: string
}