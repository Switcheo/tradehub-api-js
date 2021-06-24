import { TokenAmount } from "../token/TokenAmount";

export interface AccountPublicKey {
  type: string
  value: string
}

export interface Account {
  address: string
  coins: TokenAmount[]
  public_key: AccountPublicKey
  account_number: string
  sequence: string
}
