import { Proposal } from "./Proposal";

interface TokenParams {
  name: string
  symbol: string
  denom: string
  decimals: string
  native_decimals: string
  blockchain: string
  chain_id: string
  asset_id: string
  is_collateral: boolean
  lock_proxy_hash: string
  delegated_supply: string
  originator: string
}

export interface CreateTokenProposal extends Proposal {
  token: TokenParams
}
