import BigNumber from "bignumber.js";

export interface TxnFee {
  msg_type: string
  fee: BigNumber
}
