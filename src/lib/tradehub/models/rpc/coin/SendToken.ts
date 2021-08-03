import { TokenAmount } from "@lib/tradehub/models/rest";
import { TxMsgValue } from "@lib/tradehub/utils";

export interface SendToken extends TxMsgValue {
    from_address?: string,
    to_address: string,
    amount: TokenAmount[],
}