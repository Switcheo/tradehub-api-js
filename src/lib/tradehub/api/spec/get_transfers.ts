import { RestResponse } from "@lib/tradehub/models";

export interface GetTransfersResponse extends Array<RestResponse.Transfer> {}

export interface GetTransfersOpts {
    account?: string
}