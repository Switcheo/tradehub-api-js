import { RestResponse } from "@lib/tradehub/models";

export interface GetTradesResponse extends Array<RestResponse.Trade> {}

export interface GetTradesOpts {
    account?: string
    market?: string
    limit?: number
    before_id?: number
    after_id?: number
    order_id?: string
}