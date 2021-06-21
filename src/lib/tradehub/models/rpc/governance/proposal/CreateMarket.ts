import { Proposal } from "./Proposal";

interface CreateMarketParams {
  name: string
  display_name: string
  market_type: 'spot' | 'futures'
  description: string
  base: string
  quote: string
  lot_size: string
  tick_size: string
  min_quantity: string
  risk_step_size: string
  initial_margin_base: string
  initial_margin_step: string
  maintenance_margin_ratio: string
  max_liquidation_order_ticket: string
  max_liquidation_order_duration: string
  impact_size: string
  mark_price_band: string
  last_price_protected_band: string
  index_oracle_id: string
  expiry_time: string
  taker_fee: string
  maker_fee: string
  originator: string
}

export interface CreateMarketProposal extends Proposal {
  market: CreateMarketParams
}
