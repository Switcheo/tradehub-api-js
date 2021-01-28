export interface MarketResponse {
  base: string
  base_name: string
  base_precision: number
  closed_block_height: number
  created_block_height: number
  description: string
  display_name: string
  expiry_time: string
  impact_size: string
  index_oracle_id: string
  initial_margin_base: string
  initial_margin_step: string
  is_active: boolean
  is_settled: boolean
  last_price_protected_band: number
  lot_size: string
  maintenance_margin_ratio: string
  maker_fee: string
  mark_price_band: number
  market_type: string
  max_liquidation_order_duration: number
  max_liquidation_order_ticket: string
  min_quantity: string
  name: string
  quote: string
  quote_name: string
  quote_precision: number
  risk_step_size: string
  taker_fee: string
  tick_size: string
  type: string
}
export type GetMarketResponse = MarketResponse[]
