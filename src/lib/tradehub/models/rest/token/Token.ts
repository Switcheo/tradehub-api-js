export interface Token {
  name: string
  symbol: string
  denom: string
  decimals: number
  blockchain: string
  chain_id: number
  asset_id: string
  is_active: boolean
  is_collateral: boolean
  lock_proxy_hash: string
  delegated_supply: string
  originator: string
}
