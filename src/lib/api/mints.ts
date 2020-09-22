import { NETWORK } from '../config'
import fetch from '../utils/fetch'
export interface MintTokenRequest {
  address: string,
  amount: string,
  denom: string,
}
export async function mintTokens(msg: MintTokenRequest, net = 'LOCALHOST') {
  return fetch(`${NETWORK[net].REST_URL}/mint_tokens`, { method: 'POST', body: JSON.stringify(msg) }).then(res => res.json())
}
