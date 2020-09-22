import { getNetwork } from '../config'
import fetch from '../utils/fetch'

export function getPrices(market: string, net: string): Promise<any> {
  const network = getNetwork(net)
  return fetch(`${network.REST_URL}/get_prices?market=${market}`)
    .then(res => res.json()) // expecting a json response
}

export function getLastPrice(market: string, net: string): Promise<any> {
  return getPrices(market, net)
    .then(res => ({ price: res.last, updated_at: res.last_updated_at })) // expecting a json response
}

export function getIndexPrice(market: string, net: string): Promise<any> {
  return getPrices(market, net)
    .then(res => ({ price: res.index, updated_at: res.index_updated_at })) // expecting a json response
}
