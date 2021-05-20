import { RestResponse } from "@lib/tradehub/models";

export interface GetPositionsLargestResponse extends RestResponse.PositionsList {}

export interface GetPositionsLargestOpts {
    market: string
}