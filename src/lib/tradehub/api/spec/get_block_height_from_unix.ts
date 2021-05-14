import { RestResponse } from "@lib/tradehub/models";

export interface GetBlockHeightfromUnixResponse extends RestResponse.BlockHeight {}

export interface GetBlockHeightfromUnixOpts {
    unix: number
}