export interface Trade {
    id: string
    block_created_at: string
    taker_id: string
    taker_address: string
    taker_fee_amount: string
    taker_fee_denom: string
    taker_side: string
    maker_id: string
    maker_address: string
    maker_fee_amount: string
    maker_fee_denom: string
    maker_side: string
    market: string
    price: string
    quantity: string
    liquidation: string
    taker_username: string
    maker_username: string
    block_height: string
}