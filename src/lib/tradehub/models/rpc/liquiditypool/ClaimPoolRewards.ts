import { TxMsgValue } from "@lib/tradehub/utils";

export interface ClaimPoolRewards extends TxMsgValue{
    pool_id: string,
    originator?: string,
}

export interface ClaimMultiPoolRewards extends TxMsgValue{
    pools: string[],
    originator?: string,
}
