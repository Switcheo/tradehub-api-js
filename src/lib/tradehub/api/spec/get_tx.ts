import { RestResponse } from "@lib/tradehub/models"

export interface GetTxResponse extends RestResponse.TxnHistory {}

export interface GetTxOpts {
    id: string
}