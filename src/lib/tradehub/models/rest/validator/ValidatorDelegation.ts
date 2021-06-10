import { TokenAmount } from '../token/TokenAmount'

export interface ValidatorDelegation {
  delegator_address: string
  validator_address: string
  shares: string
  balance: TokenAmount
}
