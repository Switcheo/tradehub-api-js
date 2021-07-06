import { TxMsgValue } from "@lib/tradehub/utils";

export interface InitiateLiquidation extends TxMsgValue {
    positions: LiquidationPosition[]
    originator?: string
  }

  interface LiquidationPosition {
      market: string
      address: string
  }