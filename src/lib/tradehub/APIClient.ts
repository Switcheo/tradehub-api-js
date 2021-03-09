import { NETWORK } from '@lib/config'
import { Network } from '@lib/types'
import {
  CheckUserNameOpts, GetAccountOpts, GetAccountResponse,
  GetAccountTradesOpts,
  GetAccountTradesResponse,
  GetLeverageOpts, GetLeverageResponse, GetMarketOpts, GetMarketResponse, GetNodesResponse, GetOrderBookResponse, GetOrderOpts,
  GetOrderResponse,
  GetOrdersOpts, GetPositionOpts, GetPositionResponse,
  GetPositionsOpts, GetProfileOpts, GetProfileResponse,
  GetWalletBalanceOpts,
  GetWalletBalanceResponse,
  ListValidatorDelegationsOpts, ListValidatorDelegationsResponse,
  GetPricesOpts, GetPricesResponse
} from './api'
import APIManager from './APIConnector'
import TradehubEndpoints from './rest_endpoints'

export interface APIClientOpts {
  debugMode?: boolean
}

class APIClient {
  public readonly apiManager: APIManager<typeof TradehubEndpoints>
  public readonly debugMode: boolean

  constructor(
    public readonly network: Network,
    opts?: APIClientOpts,
  ) {
    const restUrl = NETWORK[network].REST_URL
    this.apiManager = new APIManager(restUrl, TradehubEndpoints)

    this.debugMode = opts?.debugMode ?? false
  }

  async getAccount(opts: GetAccountOpts): Promise<GetAccountResponse> {
    const queryParams = { account: opts.address }
    const routeParams = {}
    const request = this.apiManager.path('account/detail', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetAccountResponse
  }

  async getValidatorDelegations(opts: ListValidatorDelegationsOpts): Promise<ListValidatorDelegationsResponse> {
    const routeParams = { validator: opts.validator }
    const request = this.apiManager.path('validators/delegations', routeParams)
    const response = await request.get()
    return response.data as ListValidatorDelegationsResponse
  }

  async checkUsername(opts: CheckUserNameOpts): Promise<Boolean> {
    const queryParams = { account: opts.username }
    const routeParams = {}
    const request = this.apiManager.path('account/username_check', routeParams, queryParams)
    const response = await request.get()
    return response.data as Boolean
  }

  async getProfile(opts: GetProfileOpts): Promise<GetProfileResponse> {
    const queryParams = { address: opts.address }
    const routeParams = {}
    const request = this.apiManager.path('account/get_profile', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetProfileResponse
  }

  async getPosition(opts: GetPositionOpts): Promise<GetPositionResponse> {
    const queryParams = { account: opts.account, market: opts.market }
    const routeParams = {}
    const request = this.apiManager.path('history/get_position', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetPositionResponse
  }

  async getPositions(opts: GetPositionsOpts): Promise<GetPositionResponse[]> {
    const queryParams = { account: opts.account }
    const routeParams = {}
    const request = this.apiManager.path('history/get_positions', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetPositionResponse[]
  }

  async getLeverage(opts: GetLeverageOpts): Promise<GetLeverageResponse[]> {
    const queryParams = { account: opts.account }
    const routeParams = {}
    const request = this.apiManager.path('account/get_leverage', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetLeverageResponse[]
  }

  async getOrder(opts: GetOrderOpts): Promise<GetOrderResponse> {
    const queryParams = { order_id: opts.order_id }
    const routeParams = {}
    const request = this.apiManager.path('history/get_order', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetOrderResponse
  }

  async getOrders(opts: GetOrdersOpts): Promise<GetOrderResponse[]> {
    const queryParams = { 
      account: opts.account,
      market: opts.market,
      limit: opts.limit,
      before_id: opts.before_id,
      after_id: opts.after_id,
      order_status: opts.order_status,
      order_type: opts.order_type,
      order_by: opts.order_by,
      initiator: opts.initiator,
    }
    const routeParams = {}
    const request = this.apiManager.path('history/get_orders', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetOrderResponse[]
  }

  async getAccountTrades(opts: GetAccountTradesOpts): Promise<GetAccountTradesResponse> {
    const queryParams = { 
      account: opts.account,
      market: opts.market,
      limit: opts.limit,
      before_id: opts.before_id,
      after_id: opts.after_id,
      order_by: opts.order_by,
    }
    const routeParams = {}
    const request = this.apiManager.path('history/get_account_trades', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetAccountTradesResponse
  }

  async getNodes(): Promise<GetNodesResponse> {
    const request = this.apiManager.path('tradehub/get_nodes')
    const response = await request.get()
    return response.data as GetNodesResponse
  }

  async getWalletBalance(opts: GetWalletBalanceOpts): Promise<GetWalletBalanceResponse> {
    const queryParams = {
      account: opts.account,
    }
    const routeParams = {}
    const request = this.apiManager.path('account/get_balance', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetWalletBalanceResponse
  }

  async getMarket(opts: GetMarketOpts): Promise<GetMarketResponse> {
    const queryParams = {
      market: opts.market
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/get_market', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetMarketResponse
  }

  async getOrderbook(opts: GetMarketOpts): Promise<GetOrderBookResponse> {
    const queryParams = {
      market: opts.market
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/get_orderbook', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetOrderBookResponse
  }

  async getMarkets(): Promise<GetMarketResponse[]> {
    const request = this.apiManager.path('markets/get_markets')
    const response = await request.get()
    return response.data as GetMarketResponse[]
  }

  async getPrices(opts: GetPricesOpts): Promise<GetPricesResponse> {
    const queryParams = {
      market: opts.market
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/get_prices', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetPricesResponse
  }
}

export default APIClient
