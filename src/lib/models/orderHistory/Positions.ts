export interface OpenPosition {
    address: string
    allocated_margin: string
    closed_block_height: string
    closed_block_time: string
    created_block_height: string
    entry_price: string
    lots: string
    market: string
    realized_pnl: string
    type: string
    updated_block_height: string
    username: string
}

export interface ClosedPosition {
    address: string
    closed_block_height: string
    closed_block_time: string
    entry_price: string
    lots: string
    market: string
    realized_pnl: string
}