import BigNumber from "bignumber.js";

export interface Balance {
  available: BigNumber;
  denom: string;
  order: BigNumber;
  position: BigNumber;
}
