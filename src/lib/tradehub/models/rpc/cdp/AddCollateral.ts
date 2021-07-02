import { TxMsgValue } from "@lib/tradehub/utils";

export interface AddCollateral extends TxMsgValue {
    vault_type_id: string
    amount: string
    originator?: string
}