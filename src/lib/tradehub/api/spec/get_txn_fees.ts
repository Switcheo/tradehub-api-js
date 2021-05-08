import BigNumber from "bignumber.js";
import { SimpleMap } from "@lib/tradehub/utils";

export interface GetTxnFeesResponse extends SimpleMap<BigNumber> {}
