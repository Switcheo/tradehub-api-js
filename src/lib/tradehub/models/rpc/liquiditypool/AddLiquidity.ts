import { TxMsgValue } from "@lib/tradehub/utils";

export interface AddLiquidity extends TxMsgValue {
    pool_id: string
    amount_a: string
    amount_b: string
    min_shares: string
    originator?: string
}