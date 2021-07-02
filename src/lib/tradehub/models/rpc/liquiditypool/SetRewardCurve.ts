import { TxMsgValue } from "@lib/tradehub/utils";

export interface SetRewardCurve extends TxMsgValue {
    start_time: number,
    initial_reward_bps: number
    reduction_multiplier_bps: number
    reduction_interval_seconds: number
    reductions: number
    final_reward_bps: number
    originator?: string,
}