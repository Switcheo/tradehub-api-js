import { TxMsgValue } from "@lib/tradehub/utils";

export interface ClaimPoolRewards extends TxMsgValue{
    pool_id: string,
    originator?: string,
}