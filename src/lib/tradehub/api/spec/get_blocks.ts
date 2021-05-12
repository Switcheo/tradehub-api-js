import { RestResponse } from "@lib/tradehub/models";

export interface GetBlocksResponse extends Array<RestResponse.Block> {}

export interface GetBlocksOpts {
    page?: string
}