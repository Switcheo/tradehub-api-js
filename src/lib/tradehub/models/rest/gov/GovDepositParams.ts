import { TokenAmount } from "../token";

export interface GovDepositParams {
  min_deposit: TokenAmount[]
  max_deposit_period: string
}
