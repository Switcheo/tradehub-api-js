import { TxMsgValue } from "@lib/tradehub/utils";

export interface UnlinkPool extends TxMsgValue {
    pool_id: string,
    originator?: string,
}