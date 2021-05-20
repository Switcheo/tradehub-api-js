export interface LiquidityPool {
    pool_id: number
    name: string
    denom: string
    denom_a: string
    amount_a: string
    weight_a: string
    denom_b: string
    amount_b: string
    weight_b: string
    swap_fee: string
    num_quotes: number
    rewards_weight: string
    market: string
    creator_address: string
    pool_address: string
    block_height: number
    shares_amount: string
    total_commitment: string
    type: string
    volume: string
}