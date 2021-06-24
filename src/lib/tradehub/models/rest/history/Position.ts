export interface Position {
  address: string
  allocated_margin_amount: string
  allocated_margin_denom: string
  created_block_height: string
  entry_price: string
  lots: string
  market: string
  realized_pnl: string
  username: string
  position_id: string

  unrealized_pnl?: string
  total_pnl?: string
  closed_block_height?: string
  closed_block_time?: string
  type?: string
  updated_block_height?: string
  est_liquidation_price?: string
}
