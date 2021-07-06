import { TxMsgValue } from "@lib/tradehub/utils";

export interface LinkPool extends TxMsgValue {
    pool_id: string,
    market: string,
    originator?: string,
}