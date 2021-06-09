
export interface OrderBook {
  [key: string]: OrderBookRow[],
}

export interface OrderBookRow {
  price: string
  quantity: string
}
