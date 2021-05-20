import { RestResponse } from "@lib/tradehub/models";

export interface GetLiquidationTradesResponse extends Array<RestResponse.AccountTrade> {}