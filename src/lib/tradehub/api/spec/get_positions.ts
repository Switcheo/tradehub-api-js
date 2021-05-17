import { RestResponse } from "@lib/tradehub/models";

export interface GetPositionsResponse extends Array<RestResponse.Position> {}

export interface GetPositionsOpts {
    account: string
  }
  