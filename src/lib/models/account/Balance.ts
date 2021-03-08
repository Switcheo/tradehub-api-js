export interface Balance {
  available: string,
  order: string,
  position: string,
  denom: string,
}

export interface Balances {
  [key: string]: Balance
}