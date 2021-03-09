export interface AccountTrade{
  base_precision: number,
  quote_precision: number,
  fee_precision: number,
  order_id: string,
  market: string,
  side: string,
  quantity: string,
  price: string,
  fee_amount: string,
  fee_denom: string,
  address: string,
  block_height: string,
  block_created_at: string,
  id: number
}