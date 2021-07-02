import { TxMsgValue } from "@lib/tradehub/utils";

export interface CreatePool extends TxMsgValue{
    token_a_denom: string,
    token_b_denom: string,
    token_a_weight: string,
    token_b_weight: string,
    swap_fee: string,
    num_quotes: string,
    originator?: string,
}