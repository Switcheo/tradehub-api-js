import { GetActiveWalletsParams, GetLeaderboardParams } from '@lib/types';
import { bnOrZero, Network, NetworkConfigs, TxRequest } from '../utils';
import APIManager, { RequestError, RequestResult, ResponseParser } from './APIConnector';
import {
  CheckUserNameOpts, GetAccountOpts, GetAccountRealizedPnlOpts, GetAccountRealizedPnlResponse, GetAccountResponse,
  GetAccountTradesOpts,
  GetAccountTradesResponse,
  GetActiveWalletsOpts,
  GetAllValidatorsResponse,
  GetBlocksOpts,
  GetBlocksResponse,
  GetInsuranceFundBalanceResponse,
  GetLeaderboardOpts,
  GetLeverageOpts, GetLeverageResponse, GetLiquidationTradesResponse, GetLiquidityPoolsResponse, GetMarketOpts, GetMarketResponse, GetMarketStatsOpts, GetMarketStatsResponse, GetNodesResponse, GetOrderBookResponse, GetOrderOpts,
  GetOrderResponse,
  GetOrdersOpts, GetOrdersResponse, GetPositionOpts, GetPositionResponse,
  GetPositionsOpts,
  GetPricesOpts, GetPricesResponse, GetProfileOpts, GetProfileResponse,
  GetTradesOpts,
  GetTradesResponse,
  GetTxnFeesResponse,
  GetWalletBalanceOpts,
  GetWalletBalanceResponse,
  ListValidatorDelegationsOpts, ListValidatorDelegationsResponse,
  TradehubEndpoints
} from './spec';

export interface APIClientOpts {
  debugMode?: boolean
}

class APIClient {
  public readonly apiManager: APIManager<typeof TradehubEndpoints>
  public readonly debugMode: boolean

  public static DEBUG_HEADERS: boolean = false

  constructor(
    public readonly network: Network,
    opts?: APIClientOpts,
  ) {
    const restUrl = NetworkConfigs[network].RestURL;
    const responseParser: ResponseParser = this.parseResponse.bind(this);
    this.apiManager = new APIManager(restUrl, TradehubEndpoints, responseParser)

    this.debugMode = opts?.debugMode ?? false
  }

  async parseResponse(response: Response): Promise<RequestResult> {
    const { status, statusText, headers, url } = response
    const result: RequestResult = { status, statusText, headers, url }

    if (this.debugMode) {
      console.log("parsing response", url);
      console.log("status", `[${status}] ${statusText}`);
    }

    if (APIClient.DEBUG_HEADERS) {
      console.log("printing headers", response.headers);
    }

    try {
      const responseJson = await response.json()
      result.data = responseJson

      if (this.debugMode) {
        console.log("response json", JSON.stringify(result.data));
      }

    } catch (e) {
      if (this.debugMode) {
        console.error("could not parse response as json");
        console.error(e);
      }
    }

    if (response.status >= 400 && response.status < 600) {
      throw new RequestError(result, result.data?.error || 'unknown error')
    }

    return result;
  }

  // Account

  async getAccount(opts: GetAccountOpts): Promise<GetAccountResponse> {
    const queryParams = { account: opts.address }
    const routeParams = {}
    const request = this.apiManager.path('account/detail', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetAccountResponse
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

  async getLeverage(opts: GetLeverageOpts): Promise<GetLeverageResponse> {
    const queryParams = { account: opts.account }
    const routeParams = {}
    const request = this.apiManager.path('account/get_leverage', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetLeverageResponse
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

  async getAccountRealizedPnl(opts: GetAccountRealizedPnlOpts): Promise<GetAccountRealizedPnlResponse> {
    const queryParams = {
      account: opts.account,
      from: opts.from,
      to: opts.to,
    }
    const routeParams = {}
    const request = this.apiManager.path('account/get_realized_pnl', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetAccountRealizedPnlResponse
  }

  // History

  async getPosition(opts: GetPositionOpts): Promise<GetPositionResponse> {
    const queryParams = { account: opts.account, market: opts.market }
    const routeParams = {}
    const request = this.apiManager.path('history/get_position', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetPositionResponse
  }

  async getPositions(opts: GetPositionsOpts): Promise<GetPositionResponse> {
    const queryParams = { account: opts.account }
    const routeParams = {}
    const request = this.apiManager.path('history/get_positions', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetPositionResponse
  }

  async getOrder(opts: GetOrderOpts): Promise<GetOrderResponse> {
    const queryParams = { order_id: opts.order_id }
    const routeParams = {}
    const request = this.apiManager.path('history/get_order', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetOrderResponse
  }

  async getOrders(opts: GetOrdersOpts): Promise<GetOrdersResponse> {
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
    return response.data as GetOrdersResponse
  }

  async getOpenOrders(opts: GetOrdersOpts): Promise<GetOrdersResponse> {
    const queryParams = {
      account: opts.account,
      market: opts.market,
      limit: opts.limit,
      before_id: opts.before_id,
      after_id: opts.after_id,
      order_status: 'open',
      order_type: opts.order_type,
      order_by: opts.order_by,
      initiator: opts.initiator,
    }
    const routeParams = {}
    const request = this.apiManager.path('history/get_orders', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetOrdersResponse
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

  async getTrades(opts: GetTradesOpts): Promise<GetTradesResponse> {
    const queryParams = {
      account: opts.account,
      market: opts.market,
      limit: opts.limit,
      before_id: opts.before_id,
      after_id: opts.after_id,
    }
    const routeParams = {}
    const request = this.apiManager.path('history/get_trades', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetTradesResponse
  }

  async getLiquidationTrades(): Promise<GetLiquidationTradesResponse> {
    const request = this.apiManager.path('history/get_liquidation_trades')
    const response = await request.get()
    return response.data as GetLiquidationTradesResponse
  }

  // Market

  async getMarket(opts: GetMarketOpts): Promise<GetMarketResponse> {
    const queryParams = {
      market: opts.market
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/get_market', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetMarketResponse
  }

  async getMarkets(): Promise<GetMarketResponse[]> {
    const request = this.apiManager.path('markets/get_markets')
    const response = await request.get()
    return response.data as GetMarketResponse[]
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

  async getPrices(opts: GetPricesOpts): Promise<GetPricesResponse> {
    const queryParams = {
      market: opts.market
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/get_prices', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetPricesResponse
  }

  async getMarketStats(opts: GetMarketStatsOpts): Promise<GetMarketStatsResponse> {
    const queryParams = {
      market: opts.market
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/get_market_stats', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetMarketStatsResponse
  }

  async getInsuranceFundBalance(): Promise<GetInsuranceFundBalanceResponse> {
    const request = this.apiManager.path('markets/get_insurence_fund_balance')
    const response = await request.get()
    return response.data as GetInsuranceFundBalanceResponse
  }

  async getLiquidityPools(): Promise<GetLiquidityPoolsResponse> {
    const request = this.apiManager.path('markets/get_liquidity_pools')
    const response = await request.get()
    return response.data as GetLiquidityPoolsResponse
  }

  async getLeaderboard(opts: GetLeaderboardOpts): Promise<GetLeaderboardParams> {
    const queryParams = {
      market: opts.market,
      limit: opts.limit,
      offset: opts.offset,
      order: opts.order,
      from: opts.from,
      to: opts.to,
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/get_leaderboard', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetLeaderboardParams
  }

  // async getCandlesticks(opts: GetCandlesticksOpts): Promise<GetCandlesticksResponse> {

  // }

  
//
  async tx(tx: TxRequest): Promise<unknown> {
    const request = this.apiManager.path("tradehub/txs")
    const response = await request.post({ body: tx })
    return response.data
  }


  async getTxnFees(): Promise<GetTxnFeesResponse> {
    const request = this.apiManager.path('tradehub/get_txns_fees')
    const response = await request.get()
    const fees = response.data!.result
    const output: GetTxnFeesResponse = {}
    for (const item of fees) {
      output[item.msg_type] = bnOrZero(item.fee)
    }
    return output
  }

  async getValidatorDelegations(opts: ListValidatorDelegationsOpts): Promise<ListValidatorDelegationsResponse> {
    const routeParams = { validator: opts.validator }
    const request = this.apiManager.path('validators/delegations', routeParams)
    const response = await request.get()
    return response.data as ListValidatorDelegationsResponse
  }

  async getAllValidators(): Promise<GetAllValidatorsResponse> {
    const request = this.apiManager.path('validators/get_all')
    const response = await request.get()
    return response.data as GetAllValidatorsResponse
  }


  async getNodes(): Promise<GetNodesResponse> {
    const request = this.apiManager.path('tradehub/get_nodes')
    const response = await request.get()
    return response.data as GetNodesResponse
  }

  async getActiveWallets(opts: GetActiveWalletsOpts): Promise<string> {
    const queryParams = {
      token: opts.token
    }
    const routeParams = {}
    const request = this.apiManager.path('account/get_active_wallets', routeParams, queryParams)
    const response = await request.get();
    return response.data as string
  }


  async getBlocks(opts: GetBlocksOpts): Promise<GetBlocksResponse> {
    const queryParams = {
      page: opts.page
    }
    const routeParams = {}
    const request = this.apiManager.path('tradehub/get_blocks', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetBlocksResponse
  }

}

export default APIClient
