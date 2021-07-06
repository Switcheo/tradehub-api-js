import { TxMsgValue } from "@lib/tradehub/utils";

export interface CreateVote extends TxMsgValue {
    oracle_id: string,
    timestamp: string,
    data: string,
    originator?: string,
}