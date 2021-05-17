import { RestResponse } from "@lib/tradehub/models";

export interface GetPositionsCloseToLiquidationResponse extends RestResponse.PositionsList {}

export interface GetPositionsCloseToLiquidationOpts {
    market: string
    direction: string
}