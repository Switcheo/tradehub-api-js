import { TxMsgValue } from "@lib/tradehub/utils";

export interface SetRewardsWeights extends TxMsgValue {
    weights: RewardsWeight[],
    originator?: string,
}

interface RewardsWeight {
    pool_id: string,
    weight: string,
}