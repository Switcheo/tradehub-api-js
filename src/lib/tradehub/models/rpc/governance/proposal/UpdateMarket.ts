import { Proposal } from "./Proposal";

interface UpdateMarketParams {
  name: string
  display_name: string
  description: string
  min_quantity: string
  maker_fee: string
  taker_fee: string
  risk_step_size: string
  initial_margin_base: string
  initial_margin_step: string
  maintenance_margin_ratio: string
  max_liquidation_order_ticket: string
  max_liquidation_order_duration: string
  impact_size: string
  mark_price_band: string
  last_price_protected_band: string
  is_active: boolean
  originator: string
}

export interface UpdateMarketProposal extends Proposal {
  market: UpdateMarketParams
}
