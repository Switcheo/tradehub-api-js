import * as types from '../types'
import { WalletClient, SignMessageOptions }  from '../clients/wallet'
import { TransactionOptions } from '../containers/Transaction'
import { getNetwork } from '../config'
import fetch from '../utils/fetch'

interface Options extends SignMessageOptions, TransactionOptions { }

export interface CreateMarketMsg {
  name: string,
  display_name: string,
  market_type: string,
  description: string,
  base: string,
  quote: string,
  lot_size: string,
  tick_size: string,
  min_quantity: string,
  risk_step_size: string,
  initial_margin_base: string,
  initial_margin_step: string,
  maintenance_margin_ratio: string,
  max_liquidation_order_ticket: string,
  max_liquidation_order_duration: string,
  impact_size: string,
  mark_price_band: string,
  last_price_protected_band: string,
  index_oracle_id: string,
  expiry_time: string,
  taker_fee: string,
  maker_fee: string,
  originator?: string,
}

export async function createMarket(wallet: WalletClient, msg: CreateMarketMsg, options?: Options) {
  return createMarkets(wallet, [msg], options)
}

export async function createMarkets(wallet: WalletClient, msgs: CreateMarketMsg[], options?: Options) {
  const address = wallet.pubKeyBech32
  msgs = msgs.map(msg => {
    // msg.TickSize = new BigNumber(msg.TickSize).toFixed(18)
    if (!msg.originator) msg.originator = address
    return msg
  })
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.ADD_MARKET_MSG_TYPE), options)
}


export interface InitiateSettlementMsg {
  market: string,
  originator?: string,
}

export async function initiateSettlement(wallet: WalletClient, msg: InitiateSettlementMsg, options?: Options) {
  return initiateSettlements(wallet, [msg], options)
}

export async function initiateSettlements(wallet: WalletClient, msgs: InitiateSettlementMsg[], options?: Options) {
  const address = wallet.pubKeyBech32
  msgs = msgs.map(msg => {
    if (!msg.originator) msg.originator = address
    return msg
  })
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.INITIATE_SETTLEMENT_MSG_TYPE), options)
}

export function getTokens(net: string): Promise<any> {
  const network = getNetwork(net)
  return fetch(`${network.REST_URL}/get_tokens`)
    .then(res => res.json()) // expecting a json response
}
