import { TxMsgValue } from "@lib/tradehub/utils";

export interface SyncToken extends TxMsgValue {
    denom: string,
    originator?: string,
}