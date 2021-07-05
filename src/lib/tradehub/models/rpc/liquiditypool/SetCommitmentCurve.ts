import { TxMsgValue } from "@lib/tradehub/utils";

export interface SetCommitmentCurve extends TxMsgValue {
    max_duration: string,
    max_reward_multiplier: number
    originator?: string,
}