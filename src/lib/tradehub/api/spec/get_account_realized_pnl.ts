import { RestResponse } from "@lib/tradehub/models";

export interface GetAccountRealizedPnlResponse extends RestResponse.RealizedPnl {}

export interface GetAccountRealizedPnlOpts {
    account?: string
    from?: number
    to?: number
}