import { TxMsgValue } from "@lib/tradehub/utils";

export interface UpdateMarket extends TxMsgValue {
    name: string,
    display_name: string,
    description: string,
    max_liquidation_order_ticket: string,
    originator?: string,
  }