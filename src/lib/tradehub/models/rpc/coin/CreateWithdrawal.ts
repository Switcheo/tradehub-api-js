import { TxMsgValue } from "@lib/tradehub/utils";

export interface CreateWithdrawal extends TxMsgValue {
    to_address: string,
    denom: string,
    amount: string,
    fee_amount: string,
    fee_address: string,
    originator?: string,
}