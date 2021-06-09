import { RestModels } from "@lib/tradehub/models";

export interface GetCandlesticksResponse extends Array<RestModels.Candlestick> {}

export interface GetCandlesticksOpts {
    market: string
    resolution: CandlesticksResolution
    from: number
    to: number
}

type CandlesticksResolution = 1 | 5 | 30 | 60 | 360 | 1440
