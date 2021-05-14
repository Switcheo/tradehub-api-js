import { RestResponse } from "@lib/tradehub/models";

export interface GetPositionsCloseToLiquidationResponse extends RestResponse.PnlPositions {}

export interface GetPositionsCloseToLiquidationOpts {
    market: string
    direction: string
}