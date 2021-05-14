import { RestResponse } from "@lib/tradehub/models";

export interface GetCosmosBlockInfoResponse extends RestResponse.CosmosBlock {}

export interface GetCosmosBlockInfoOpts {
    blockheight: string
}