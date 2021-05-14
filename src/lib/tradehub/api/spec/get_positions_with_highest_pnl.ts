import { RestResponse } from "@lib/tradehub/models";

export interface GetPositionsWithHightstPnlResponse extends RestResponse.PositionsList {}

export interface GetPositionsWithHightstPnlOpts {
    market: string
}