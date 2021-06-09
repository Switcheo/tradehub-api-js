import { RestModels } from "@lib/tradehub/models";

export interface GetTxsResponse extends Array<RestModels.Txn> {}

export interface GetTxsOpts {
    address?: string
    msg_type?: string
    height?: string
    start_block?: string
    end_block?: string
    before_id?: string
    after_id?: string
    order_by?: string
    limit?: string
}
