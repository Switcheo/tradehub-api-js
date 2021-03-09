import { TokenAmount } from '../token/TokenAmount'

export interface Delegation {
  delegator_address: string
  validator_address: string
  shares: number
  balance: TokenAmount
}
