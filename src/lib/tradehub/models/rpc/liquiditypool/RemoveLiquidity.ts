import { TxMsgValue } from "@lib/tradehub/utils";

export interface RemoveLiquidity extends TxMsgValue {
    pool_id: string,
    shares: string,
    originator?: string,
}