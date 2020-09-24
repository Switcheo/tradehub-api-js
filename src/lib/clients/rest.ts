import fetch from '../utils/fetch'

import { camelCaseDeep } from "../utils/json"
import { getNetwork } from '../config'
import { WalletClient } from './wallet'


export enum Direction {
  long = 'long',
  short = 'short',
}

interface PriceLevel {
  price: string
  quantity: string
}

interface OrderBook {
  asks: Array<PriceLevel>
  bids: Array<PriceLevel>
}


interface Balance {
  available: string
  denom: string
  order: string
  position: string
}

interface WalletBalance {
  [key: string]: Balance
}

interface GetOrdersOptions {
  address?: string
  market?: string
  limit?: number
  beforeId?: number
  afterId?: number
  status?: string
  orderType?: string
}

interface GetTradesOptions {
  address?: string
  market?: string
  limit?: number
  beforeId?: number
  afterId?: number
}

// TODO: include optional params such as pagination and limit
// TODO: response typings

export interface REST {
  checkUsername(username: string): Promise<boolean>
  getAccount(address?: string): Promise<object>
  getProfile(address?: string): Promise<object>
  getMarkets(): Promise<Array<object>>
  getMarket(market: string): Promise<object>
  getLeaderboard(market: string): Promise<Array<object>>
  getActiveWallets(token: string): Promise<string>
  getAllValidators(): Promise<Array<object>>
  getPrices(market: string): Promise<object>
  getTx(hash: string): Promise<object>
  getTxs(): Promise<Array<object>>
  getTxLog(hash: string): Promise<object>
  getTxTypes(): Promise<Array<string>>
  getTotalBalances(): Promise<Array<object>>
  getRichList(token: string): Promise<Array<object>>
  getAverageBlocktime(): Promise<string>
  getInsuranceFundBalance(): Promise<Array<object>>
  getPositionsWithHighestPnL(market: string): Promise<Array<object>>
  getPositionsCloseToLiquidation(market: string, direction: Direction): Promise<Array<object>>
  getPositionsLargest(market: string): Promise<Array<object>>
  getMarketStats(market?: string): Promise<Array<object>>
  getOrderBook(market: string): Promise<OrderBook>
  getPosition(market: string, address?: string): Promise<object>
  getPositions(address?: string): Promise<Array<object>>
  getLeverage(market: string, address?: string): Promise<object>
  getOrder(id: string): Promise<object>
  getBlocks(page?: number): Promise<Array<object>>
  getWalletBalance(address?: string): Promise<WalletBalance>
  getOrders(options: GetOrdersOptions): Promise<Array<object>>
  getOpenOrders(options: GetOrdersOptions): Promise<Array<object>>
  getAccountTrades(options: GetTradesOptions): Promise<Array<object>>
  getLiquidationTrades(): Promise<Array<object>>
  getTrades(options: GetTradesOptions): Promise<Array<object>>
}

export class RestClient implements REST {
  protected baseUrl: string
  private wallet: WalletClient

  constructor(network: string, wallet?: WalletClient) {
    this.baseUrl = getNetwork(network).REST_URL
    this.wallet = wallet
  }

  protected async fetchJson(relativeUrl: string): Promise<any> {
    const url: string = `${this.baseUrl}${relativeUrl}`
    const res = await fetch(url)
    const json = await res.json()
    return camelCaseDeep(json)
  }

  //
  // PUBLIC METHODS
  //

  // Account

  public async getAccount(address?: string) {
    if (!address && !this.wallet) {
      throw new Error('get_account: missing address param')
    }
    if (!address) {
      address = this.wallet.pubKeyBech32
    }
    return this.fetchJson(`/get_account?account=${address}`)
  }

  public async checkUsername(username: string) {
    return this.fetchJson(`/username_check?username=${username}`)
  }

  public async getProfile(address?: string) {
    if (!address && !this.wallet) {
      throw new Error('get_account: missing address param')
    }
    if (!address) {
      address = this.wallet.pubKeyBech32
    }
    return this.fetchJson(`/get_profile?account=${address}`)
  }

  public async getPosition(market: string, address?: string) {
    if (!address && !this.wallet) {
      throw new Error('get_account: missing address param')
    }
    if (!address) {
      address = this.wallet.pubKeyBech32
    }
    return this.fetchJson(`/get_position?account=${address}&market=${market}`)
  }

  public async getPositions(address?: string) {
    if (!address && !this.wallet) {
      throw new Error('get_account: missing address param')
    }
    if (!address) {
      address = this.wallet.pubKeyBech32
    }
    return this.fetchJson(`/get_position?account=${address}`)
  }

  public async getLeverage(market: string, address?: string) {
    if (!address && !this.wallet) {
      throw new Error('get_account: missing address param')
    }
    if (!address) {
      address = this.wallet.pubKeyBech32
    }
    return this.fetchJson(`/get_leverage?account=${address}&market=${market}`)
  }

  public async getOrder(id: string) {
    return this.fetchJson(`/get_order?order_id=${id}`)
  }

  public async getOrders(options: GetOrdersOptions) {
    const {
      address,
      market,
      limit,
      beforeId,
      afterId,
      status,
      orderType,
    } = options

    let url = '/get_orders?'

    if (!address) {
      if (!this.wallet) {
        url += `address=${this.wallet.pubKeyBech32}&`
      }
    } else {
      url += `address=${address}&`
    }

    if (!market) {
      url += `market=${market}&`
    }
    if (!limit) {
      url += `limit=${limit}&`
    }
    if (!beforeId) {
      url += `before_id=${beforeId}&`
    }
    if (!afterId) {
      url += `after_id=${afterId}&`
    }
    if (!status) {
      url += `status=${status}&`
    }
    if (!orderType) {
      url += `order_type=${orderType}&`
    }
    return this.fetchJson(url)
  }

  public async getOpenOrders(options: GetOrdersOptions) {
    const {
      address,
      market,
      limit,
      beforeId,
      afterId,
      orderType,
    } = options

    let url = '/get_orders?'

    if (!address) {
      url += `address=${this.wallet.pubKeyBech32}&`
    } else {
      url += `address=${address}&`
    }

    url += `order_status=open&`

    if (!market) {
      url += `market=${market}&`
    }
    if (!limit) {
      url += `limit=${limit}&`
    }
    if (!beforeId) {
      url += `before_id=${beforeId}&`
    }
    if (!afterId) {
      url += `after_id=${afterId}&`
    }
    if (!orderType) {
      url += `order_type=${orderType}&`
    }
    return this.fetchJson(url)
  }

  public async getAccountTrades(options: GetTradesOptions) {
    const {
      address,
      market,
      limit,
      beforeId,
      afterId,
    } = options

    let url = '/get_trades_by_account?'

    if (!address && !this.wallet) {
      throw new Error('get_account: missing address param')
    }
    if (!address) {
      url += `address=${this.wallet.pubKeyBech32}&`
    } else {
      url += `address=${address}&`
    }
    if (!market) {
      url += `market=${market}&`
    }
    if (!limit) {
      url += `limit=${limit}&`
    }
    if (!beforeId) {
      url += `before_id=${beforeId}&`
    }
    if (!afterId) {
      url += `after_id=${afterId}&`
    }

    return this.fetchJson(url)
  }

  public async getWalletBalance(address?: string) {
    if (!address && !this.wallet) {
      throw new Error('get_account: missing address param')
    }
    if (!address) {
      address = this.wallet.pubKeyBech32
    }
    return this.fetchJson(`/get_balance?account=${address}`)
  }

  // Market Info

  public async getMarket(market: string) {
    return this.fetchJson(`/get_market?market=${market}`)
  }

  public async getOrderBook(market: string) {
    return this.fetchJson(`/get_orderbook?market=${market}`)
  }

  public async getMarkets() {
    return this.fetchJson(`/get_markets`)
  }

  public async getPrices(market: string) {
    return this.fetchJson(`/get_prices?market=${market}`)
  }

  public async getMarketStats(market?: string) {
    let url = '/get_market_stats'
    if (market) {
      url = url + `?market=${market}`
    }
    return this.fetchJson(url)
  }

  public async getInsuranceFundBalance() {
    return this.fetchJson(`/get_insurance_balance`)
  }

  public async getTrades(options: GetTradesOptions) {
    const {
      address,
      market,
      limit,
      beforeId,
      afterId,
    } = options

    let url = '/get_trades?'


    if (!address) {
      if (!this.wallet) {
        url += `address=${this.wallet.pubKeyBech32}&`
      }
    } else {
      url += `address=${address}&`
    }
    if (!market) {
      url += `market=${market}&`
    }
    if (!limit) {
      url += `limit=${limit}&`
    }
    if (!beforeId) {
      url += `before_id=${beforeId}&`
    }
    if (!afterId) {
      url += `after_id=${afterId}&`
    }

    return this.fetchJson(url)
  }

  public async getLiquidationTrades() {
    return this.fetchJson(`/get_liquidations`)
  }
  // Leaderboard

  public async getLeaderboard(market: string) {
    return this.fetchJson(`/get_top_r_profits?market=${market}`)
  }

  public async getPositionsWithHighestPnL(market: string) {
    return this.fetchJson(`/get_positions_sorted_by_pnl1?market=${market}`)
  }

  public async getPositionsCloseToLiquidation(market: string, direction: Direction) {
    return this.fetchJson(`/get_positions_sorted_by_risk?market=${market}&direction=${direction}`)
  }

  public async getPositionsLargest(market: string) {
    return this.fetchJson(`/get_positions_sorted_by_size?market=${market}`)
  }

  // Blockchain Stats

  public async getActiveWallets(token: string) {
    return this.fetchJson(`/get_active_wallets?token=${token}`)
  }

  public async getAllValidators() {
    return this.fetchJson(`/get_all_validators`)
  }

  public async getTx(hash: string) {
    return this.fetchJson(`/get_transaction?hash=${hash}`)
  }

  public async getTxs() {
    return this.fetchJson(`/get_transactions`)
  }

  public async getTxLog(hash: string) {
    return this.fetchJson(`/get_tx_log?hash=${hash}`)
  }

  public async getTxTypes() {
    return this.fetchJson(`/get_transaction_types`)
  }

  public async getTotalBalances() {
    return this.fetchJson(`/get_total_balances`)
  }

  public async getRichList(token: string) {
    return this.fetchJson(`/get_rich_list?=token=${token}`)
  }

  public async getAverageBlocktime() {
    return this.fetchJson(`/get_block_time`)
  }

  public async getBlocks(page: number) {
    let url = '/get_blocks'
    if (page) {
      url = url + `?page=${page}`
    }
    return this.fetchJson(url)
  }

  // PRIVATE METHODS



}