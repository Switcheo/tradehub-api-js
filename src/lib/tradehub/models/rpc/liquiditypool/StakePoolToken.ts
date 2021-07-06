import { TxMsgValue } from "@lib/tradehub/utils";

export interface StakePoolToken extends TxMsgValue {
    denom: string,
    amount: string,
    duration: string, // seconds
    originator?: string,
}