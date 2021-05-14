import { RestResponse } from "@lib/tradehub/models";

export interface GetTokensResponse extends Array<RestResponse.Token> {}