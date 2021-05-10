import { TxMsgValue } from "@lib/tradehub/utils";

export interface CreateOrder extends TxMsgValue {
  market: string,
  side: string,
  quantity: string,
  type: string,
  price?: string,
  stop_price?: string,
  time_in_force?: string,
  trigger_type?: string,
  is_reduce_only?: boolean,
  is_post_only?: boolean,
  originator?: string,
}
