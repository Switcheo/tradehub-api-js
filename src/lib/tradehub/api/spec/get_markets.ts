import { RestResponse } from "@lib/tradehub/models";

export interface GetMarketsResponse extends Array<RestResponse.Market> {}