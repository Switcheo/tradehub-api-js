import { TxMsgValue } from "@lib/tradehub/utils";

export interface UnstakePoolToken extends TxMsgValue {
    denom: string,
    amount: string,
    originator?: string,
}