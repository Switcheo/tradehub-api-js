import { TxMsgValue } from "@lib/tradehub/utils";

export interface RemoveDebt extends TxMsgValue {
    vault_type_id: string
    amount: string
    originator?: string
}