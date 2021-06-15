export interface TxnHistory {
    id: string
    hash: string
    address: string
    username: string
    msgs: Array<TxnMessage>
    code: string
    gas_used: string
    gas_limit: string
    memo: string
    height: string
    block_time: string
}

export interface TxnMessage {
    msg_type: string
    msg: string
}