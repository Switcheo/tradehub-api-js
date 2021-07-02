import { TxMsgValue } from "@lib/tradehub/utils";

export interface EditOrder extends TxMsgValue{
    id: string,
    quantity?: string,
    price?: string,
    stop_price?: string,
    originator?: string,
}  