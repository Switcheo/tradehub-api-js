import { TxMsgValue } from "@lib/tradehub/utils";

export interface ChangeSwapFee extends TxMsgValue {
    pool_id: string,
    swap_fee: string,
    originator?: string,
}