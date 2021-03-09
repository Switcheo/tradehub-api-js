export interface HistoryOrder {
    address: string
    allocated_margin: string
    available: string
    block_created_at: string
    block_height: number
    filled: string
    id: string
    initiator: string
    is_liquidation: boolean
    is_post_only: boolean
    is_reduce_only: boolean
    market: string
    order_id: string
    order_status: string
    order_type: string
    price: string
    quantity: string
    side: string
    stop_price: string
    time_in_force: string
    trigger_type: string
    triggered_block_height: number
    type: string
    username: string
}