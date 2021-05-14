import { RestResponse } from "@lib/tradehub/models";

export interface GetMarketStatsResponse extends Array<RestResponse.MarketStat> {}

export interface GetMarketStatsOpts {
    market?: string
}