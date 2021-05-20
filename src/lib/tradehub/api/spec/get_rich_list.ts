import { RestResponse } from "@lib/tradehub/models";

export interface GetRichListResponse extends Array<RestResponse.UserToken> {}

export interface GetRichListOpts {
    token: string
}