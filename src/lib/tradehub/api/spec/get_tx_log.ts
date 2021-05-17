import { RestResponse } from "@lib/tradehub/models";

export interface GetTxLogResponse extends RestResponse.TxLog {}

export interface GetTxLogOpts {
    hash: string
}