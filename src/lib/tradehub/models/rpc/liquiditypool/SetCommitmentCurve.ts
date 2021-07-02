import { TxMsgValue } from "@lib/tradehub/utils";

export interface SetCommitmentCurve extends TxMsgValue {
    max_duration: number,
    max_reward_multiplier: number
    originator?: string,
}