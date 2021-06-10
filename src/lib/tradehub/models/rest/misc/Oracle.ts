import BigNumber from "bignumber.js";

export interface Oracle {
  oracle_id: string,
  block_height: number,
  timestamp: number,
  data: BigNumber
}
