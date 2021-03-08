export interface OrderBook {
  [key: string]: Side,
}

interface Side extends Array<OrderBookRow> {}

interface OrderBookRow {
  price: string
  quantity: string
}