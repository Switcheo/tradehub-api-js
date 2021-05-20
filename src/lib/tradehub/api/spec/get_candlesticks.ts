import { RestResponse } from "@lib/tradehub/models";

export interface GetCandlesticksResponse extends Array<RestResponse.Candlestick> {}

export interface GetCandlesticksOpts {
    market: string
    resolution: CandlesticksResolution
    from: number
    to: number
}

type CandlesticksResolution = 1 | 5 | 30 | 60 | 360 | 1440