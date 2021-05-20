import { RestResponse } from "@lib/tradehub/models";

export interface GetTokenResponse extends RestResponse.Token {}

export interface GetTokenOpts {
    token: string
}