import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { RestModels } from '../models';
import { Oracle } from '../models/rest';
import { RestTypes } from '../sdk';
import { bnOrZero, BN_ONE, BN_ZERO, BroadcastTx, SimpleMap } from '../utils';
import APIManager, { RequestError, RequestResult, ResponseParser } from './APIConnector';
import {
  CheckUserNameOpts, CosmosResponse, GetAccountOpts, GetAccountRealizedPnlOpts, GetAccountResponse,
  GetAccountTradesOpts,
  GetActiveWalletsOpts,
  GetAMMRewardPercentageResponse,
  GetBlockHeightfromUnixOpts,
  GetBlocksOpts,
  GetCandlesticksOpts,
  GetCandlesticksResponse,
  GetCommitmentCurveResponse,
  GetCosmosBlockInfoOpts,
  GetDelegatorDelegationRewardsOpts,
  GetDelegatorDelegationRewardsResponse,
  GetDelegatorDelegationsOpts,
  GetDelegatorDelegationsResponse,
  GetDelegatorRedelegationsOpts,
  GetDelegatorRedelegationsResponse,
  GetDelegatorUnbondingDelegationsOpts,
  GetDelegatorUnbondingDelegationsResponse,
  GetDistributionParamsResponse,
  GetGovProposalOpts, GetLastClaimedPoolRewardOpts, GetLastClaimedPoolRewardResponse, GetLeaderboardOpts,
  GetLeverageOpts, GetMarketOpts, GetMarketsOpts, GetMarketStatsOpts, GetOrderbookOpts, GetOrderOpts,
  GetOrdersOpts, GetPositionOpts,
  GetPositionsCloseToLiquidationOpts,
  GetPositionsLargestOpts,
  GetPositionsOpts,
  GetPositionsWithHightstPnlOpts,
  GetPricesOpts, GetProfileOpts,
  GetRewardCurveResponse,
  GetRewardHistoryOpts,
  GetRewardHistoryResponse,
  GetRewardsDistributedOpts,
  GetRichListOpts,
  GetSlashingParamsResponse,
  GetSlashingSigningInfoResponse,
  GetStakedPoolTokenOpts,
  GetStakedPoolTokenResponse,
  GetStakingPoolResponse,
  GetStakingValidatorsResponse,
  GetTokenOpts,
  GetTotalSupplyOpts,
  GetTradesOpts,
  GetTransfersOpts,
  GetTxLogOpts,
  GetTxOpts,
  GetTxsOpts,
  GetUnbondedStakingValidatorsResponse,
  GetUnbondingStakingValidatorsResponse,
  GetWalletBalanceOpts,
  GovDepositParamsResponse, GovGetProposalResponse, GovListProposalResponse, GovLiveTallyResponse,
  GovProposerResponse, GovTallyParamsResponse, ListGovProposalOpts, ListValidatorDelegationsOpts, ListValidatorDelegationsResponse,
  parseCosmosDate,
  ResultsMinMax,
  ResultsPaged,
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
    restUrl: string,
    opts?: APIClientOpts,
  ) {
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

  // Generic

  async tx(tx: BroadcastTx): Promise<unknown> {
    const request = this.apiManager.path("tradehub/txs")
    const response = await request.post({ body: tx })
    return response.data
  }

  async getTx(opts: GetTxOpts): Promise<RestModels.TxnHistory> {
    const queryParams = { hash: opts.hash }
    const routeParams = {}
    const request = this.apiManager.path('tradehub/get_tx', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.TxnHistory
  }

  async getTxs(opts: GetTxsOpts): Promise<RestModels.Txn[]> {
    const queryParams = {
      address: opts.address,
      msg_type: opts.msg_type,
      height: opts.height,
      start_block: opts.start_block,
      end_block: opts.end_block,
      before_id: opts.before_id,
      after_id: opts.after_id,
      order_by: opts.order_by,
      limit: opts.limit,
    }
    const routeParams = {}
    const request = this.apiManager.path('tradehub/get_txs', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.Txn[]
  }

  async getTxsPaged(opts: GetTxsOpts): Promise<ResultsMinMax<RestModels.Txn[]>> {
    const queryParams = {
      address: opts.address,
      msg_type: opts.msg_type,
      height: opts.height,
      start_block: opts.start_block,
      end_block: opts.end_block,
      before_id: opts.before_id,
      after_id: opts.after_id,
      order_by: opts.order_by,
      limit: opts.limit,
      pagination: true,
    }
    const routeParams = {}
    const request = this.apiManager.path('tradehub/get_txs', routeParams, queryParams)
    const response = await request.get()
    return response.data as ResultsMinMax<RestModels.Txn[]>
  }

  async getTxnFees(): Promise<SimpleMap<BigNumber>> {
    const request = this.apiManager.path('tradehub/get_txns_fees')
    const response = await request.get()
    const fees = response.data!.result
    const output: SimpleMap<BigNumber> = {}
    for (const item of fees) {
      output[item.msg_type] = bnOrZero(item.fee)
    }
    return output
  }

  // todo error in api call
  async getTxLog(opts: GetTxLogOpts): Promise<RestModels.TxLog> {
    const queryParams = { hash: opts.hash }
    const routeParams = {}
    const request = this.apiManager.path('tradehub/get_tx_log', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.TxLog
  }

  async getTxTypes(): Promise<string[]> {
    const request = this.apiManager.path('tradehub/get_tx_types')
    const response = await request.get()
    return response.data as string[]
  }

  async getNodes(): Promise<RestModels.NodeData> {
    const request = this.apiManager.path('tradehub/get_nodes')
    const response = await request.get()
    return response.data as RestModels.NodeData
  }

  async getBlocks(opts: GetBlocksOpts): Promise<RestModels.Block[]> {
    const queryParams = {
      ...opts,
    }
    const routeParams = {}
    const request = this.apiManager.path('tradehub/get_blocks', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.Block[]
  }

  async getBlocksPaged(opts: GetBlocksOpts): Promise<ResultsMinMax<RestModels.Block>> {
    const queryParams = {
      ...opts,
      pagination: true,
    }
    const routeParams = {}
    const request = this.apiManager.path('tradehub/get_blocks', routeParams, queryParams)
    const response = await request.get()
    return response.data as ResultsMinMax<RestModels.Block>
  }

  // response data, evidence null | unknown
  async getCosmosBlockInfo(opts: GetCosmosBlockInfoOpts): Promise<RestModels.CosmosBlock> {
    const request = this.apiManager.path('tradehub/get_cosmos_block', opts)
    const response = await request.get()
    return response.data as RestModels.CosmosBlock
  }

  async getBlockHeightfromUnix(opts: GetBlockHeightfromUnixOpts): Promise<RestModels.BlockHeight> {
    const queryParams = { unix: opts.unix }
    const routeParams = {}
    const request = this.apiManager.path('tradehub/get_block_height_from_unix', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.BlockHeight
  }

  async getAverageBlocktime(): Promise<string> {
    const request = this.apiManager.path('tradehub/get_average_block_time')
    const response = await request.get()
    return response.data as string
  }

  async getToken(opts: GetTokenOpts): Promise<RestModels.Token> {
    const queryParams = { token: opts.token }
    const routeParams = {}
    const request = this.apiManager.path('tradehub/get_token', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.Token
  }

  async getTokens(): Promise<RestModels.Token[]> {
    const request = this.apiManager.path('tradehub/get_tokens')
    const response = await request.get()
    return response.data as RestModels.Token[]
  }

  async getRichList(opts: GetRichListOpts): Promise<RestModels.UserToken[]> {
    const queryParams = { token: opts.token }
    const routeParams = {}
    const request = this.apiManager.path('tradehub/get_rich_list', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.UserToken[]
  }

  async search(keyword: string): Promise<RestModels.SearchResult> {
    const queryParams = { keyword }
    const request = this.apiManager.path('tradehub/search', {}, queryParams)
    const response = await request.get()
    return response.data as RestModels.SearchResult
  }

  // Account

  async getAccount(opts: GetAccountOpts): Promise<GetAccountResponse> {
    const queryParams = { account: opts.address }
    const routeParams = {}
    const request = this.apiManager.path('account/detail', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetAccountResponse
  }

  async getAccountInfo(opts: GetAccountOpts): Promise<GetAccountResponse> {
    const routeParams = { address: opts.address };
    const request = this.apiManager.path('account/info', routeParams)
    const response = await request.get()
    return response.data as GetAccountResponse
  }

  async checkUsername(opts: CheckUserNameOpts): Promise<Boolean> {
    const queryParams = { username: opts.username }
    const routeParams = {}
    const request = this.apiManager.path('account/username_check', routeParams, queryParams)
    const response = await request.get()
    return response.data as Boolean
  }

  async getAddressForUsername(opts: CheckUserNameOpts): Promise<string | null> {
    const queryParams = { username: opts.username }
    const routeParams = {}
    const request = this.apiManager.path('account/get_address', routeParams, queryParams)
    try {
      const response = await request.get()
      return response.data
    } catch (error) {
      return null
    }
  }

  async getProfile(opts: GetProfileOpts): Promise<RestModels.Profile> {
    const queryParams = { account: opts.account }
    const routeParams = {}
    const request = this.apiManager.path('account/get_profile', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.Profile
  }

  async getLeverage(opts: GetLeverageOpts): Promise<RestModels.Leverage> {
    const queryParams = {
      account: opts.account,
      market: opts.market,
    }
    const routeParams = {}
    const request = this.apiManager.path('account/get_leverage', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.Leverage
  }

  async getWalletBalance(opts: GetWalletBalanceOpts): Promise<RestModels.Balances> {
    const queryParams = {
      account: opts.account,
    }
    const routeParams = {}
    const request = this.apiManager.path('account/get_balance', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.Balances
  }

  async getTotalBalances(): Promise<RestModels.Balance[]> {
    const request = this.apiManager.path('account/get_total_balances')
    const response = await request.get()
    return response.data as RestModels.Balance[]
  }

  async getAccountRealizedPnl(opts: GetAccountRealizedPnlOpts): Promise<RestModels.RealizedPnl> {
    const queryParams = {
      account: opts.account,
      from: opts.from,
      to: opts.to,
    }
    const routeParams = {}
    const request = this.apiManager.path('account/get_realized_pnl', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.RealizedPnl
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

  async getTransfers(opts: GetTransfersOpts): Promise<RestModels.Transfer[]> {
    const queryParams = {
      account: opts.account,
    }
    const routeParams = {}
    const request = this.apiManager.path('account/get_transfers', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.Transfer[]
  }

  // History

  async getPosition(opts: GetPositionOpts = {}): Promise<RestModels.Position> {
    const request = this.apiManager.path('history/get_position', {}, opts)
    const response = await request.get()
    return response.data as RestModels.Position
  }

  async getPositions(opts: GetPositionsOpts = {}): Promise<RestModels.Position[]> {
    const request = this.apiManager.path('history/get_positions', {}, opts)
    const response = await request.get()
    return response.data as RestModels.Position[]
  }

  async getPositionsPaged(opts: GetPositionsOpts = {}): Promise<RestTypes.ResultsMinMax<RestModels.Position>> {
    const queryParams = {
      ...opts,
      pagination: true,
    }
    const request = this.apiManager.path('history/get_positions', {}, queryParams)
    const response = await request.get()
    return response.data as RestTypes.ResultsMinMax<RestModels.Position>
  }

  async getOrder(opts: GetOrderOpts): Promise<RestModels.Order> {
    const queryParams = { order_id: opts.order_id }
    const request = this.apiManager.path('history/get_order', {}, queryParams)
    const response = await request.get()
    return response.data as RestModels.Order
  }

  async getOrders(opts: GetOrdersOpts): Promise<RestModels.Order[]> {
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
    return response.data as RestModels.Order[]
  }

  async getOrdersPaged(opts: GetOrdersOpts): Promise<ResultsMinMax<RestModels.Order>> {
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
      pagination: true,
    }
    const routeParams = {}
    const request = this.apiManager.path('history/get_orders', routeParams, queryParams)
    const response = await request.get()
    return response.data as ResultsMinMax<RestModels.Order>
  }

  async getAccountTrades(opts: GetAccountTradesOpts): Promise<RestModels.AccountTrade[]> {
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
    return response.data as RestModels.AccountTrade[]
  }

  async getAccountTradesPaged(opts: GetAccountTradesOpts): Promise<ResultsMinMax<RestModels.AccountTrade>> {
    const queryParams = {
      account: opts.account,
      market: opts.market,
      limit: opts.limit,
      before_id: opts.before_id,
      after_id: opts.after_id,
      order_by: opts.order_by,
      pagination: true,
    }
    const routeParams = {}
    const request = this.apiManager.path('history/get_account_trades', routeParams, queryParams)
    const response = await request.get()
    return response.data as ResultsMinMax<RestModels.AccountTrade>
  }

  async getTrades(opts: GetTradesOpts): Promise<RestModels.Trade[]> {
    const queryParams = {
      account: opts.account,
      market: opts.market,
      limit: opts.limit,
      before_id: opts.before_id,
      after_id: opts.after_id,
      before_block: opts.before_block,
      after_block: opts.after_block,
      order_id: opts.order_id,
    }
    const routeParams = {}
    const request = this.apiManager.path('history/get_trades', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.Trade[]
  }

  async getTradesPaged(opts: GetTradesOpts): Promise<ResultsMinMax<RestModels.Trade>> {
    const queryParams = {
      account: opts.account,
      market: opts.market,
      limit: opts.limit,
      before_id: opts.before_id,
      after_id: opts.after_id,
      before_block: opts.before_block,
      after_block: opts.after_block,
      pagination: true,
      order_id: opts.order_id,
    }
    const routeParams = {}
    const request = this.apiManager.path('history/get_trades', routeParams, queryParams)
    const response = await request.get()
    return response.data as ResultsMinMax<RestModels.Trade>
  }

  async getLiquidationTrades(): Promise<RestModels.AccountTrade[]> {
    const request = this.apiManager.path('history/get_liquidation_trades')
    const response = await request.get()
    return response.data as RestModels.AccountTrade[]
  }

  // Market

  async getMarket(opts: GetMarketOpts): Promise<RestModels.Market> {
    const queryParams = {
      market: opts.market
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/get_market', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.Market
  }

  async getMarkets(opts: GetMarketsOpts = {}): Promise<RestModels.Market[]> {
    const queryParams = { ...opts }
    const request = this.apiManager.path('markets/get_markets', {}, queryParams)
    const response = await request.get()
    return response.data as RestModels.Market[]
  }

  async getOrderbook(opts: GetOrderbookOpts): Promise<RestModels.OrderBook> {
    const queryParams = {
      market: opts.market
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/get_orderbook', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.OrderBook
  }

  async getOracleResults(): Promise<SimpleMap<RestModels.Oracle>> {
    const request = this.apiManager.path('oracle/get_results')
    const response = await request.get()

    Object.values(response.data).forEach((item: any) => {
      response.data[item.oracle_id] = {
        ...item,
        block_height: parseInt(item.block_height),
        data: bnOrZero(item.data),
      } as Oracle
    })
    return response.data as SimpleMap<RestModels.Oracle>
  }

  async getPrices(opts: GetPricesOpts): Promise<RestModels.Price> {
    const queryParams = {
      market: opts.market
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/get_prices', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.Price
  }

  async getMarketStats(opts: GetMarketStatsOpts): Promise<RestModels.MarketStat[]> {
    const queryParams = {
      market: opts.market
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/get_market_stats', routeParams, queryParams)
    const response = await request.get()
    return response.data as RestModels.MarketStat[]
  }

  async getInsuranceFundBalance(): Promise<RestModels.InsuranceFundBalance[]> {
    const request = this.apiManager.path('markets/get_insurance_fund_balance')
    const response = await request.get()
    return response.data as RestModels.InsuranceFundBalance[]
  }

  async getLiquidityPools(): Promise<RestModels.LiquidityPool[]> {
    const request = this.apiManager.path('markets/get_liquidity_pools')
    const response = await request.get()
    return response.data as RestModels.LiquidityPool[]
  }

  async getRewardCurve(): Promise<GetRewardCurveResponse> {
    const request = this.apiManager.path('markets/get_reward_curve')
    const response = await request.get()
    return response.data as GetRewardCurveResponse
  }

  async getCommitmentCurve(): Promise<GetCommitmentCurveResponse> {
    const request = this.apiManager.path('markets/get_commitment_curve')
    const response = await request.get()
    return response.data as GetCommitmentCurveResponse
  }

  async getRewardsDistributed(opts: GetRewardsDistributedOpts): Promise<RestModels.TokenAmount[]> {
    const request = this.apiManager.path('markets/get_rewards_distributed', {}, opts)
    const response = await request.get()
    return response.data as RestModels.TokenAmount[]
  }

  async getWeeklyLPRewardAlloc(): Promise<BigNumber> {
    const rewardCurve = await this.getRewardCurve()
    const initialReward = new BigNumber(rewardCurve.result.initial_reward)
    const reductionFactor = BN_ONE.minus(new BigNumber(rewardCurve.result.reduction).shiftedBy(-4))
    const totalReduction = reductionFactor.pow(new BigNumber(rewardCurve.result.reductions_made))
    const currentReward = initialReward.times(totalReduction)
    const poolAllocation = BigNumber.max(new BigNumber(rewardCurve.result.final_reward), currentReward).shiftedBy(-4)
    return poolAllocation
  }

  async getWeeklyPoolRewards(): Promise<BigNumber> {
    const total = await this.getWeeklyRewards()
    const poolAllocation = await this.getWeeklyLPRewardAlloc()
    return new BigNumber(total).times(poolAllocation).dp(8)
  }

  async getLastClaimedPoolReward(opts: GetLastClaimedPoolRewardOpts): Promise<GetLastClaimedPoolRewardResponse> {
    const request = this.apiManager.path('markets/get_last_claimed_pool_reward', opts)
    const response = await request.get()
    return response.data as GetLastClaimedPoolRewardResponse
  }

  async getRewardHistory(opts: GetRewardHistoryOpts): Promise<GetRewardHistoryResponse> {
    const request = this.apiManager.path('markets/get_reward_history', opts)
    const response = await request.get()
    return response.data as GetRewardHistoryResponse
  }

  async getLeaderboard(opts: GetLeaderboardOpts): Promise<RestModels.LeaderboardResult> {
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
    return response.data as RestModels.LeaderboardResult
  }

  async getPositionsByPNL(opts: GetPositionsWithHightstPnlOpts): Promise<ResultsPaged<RestModels.Position>> {
    const queryParams = {
      market: opts.market,
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/get_positions_sorted_by_pnl', routeParams, queryParams)
    const response = await request.get()
    return response.data as ResultsPaged<RestModels.Position>
  }

  async getPositionsByRisk(opts: GetPositionsCloseToLiquidationOpts): Promise<ResultsPaged<RestModels.Position>> {
    const queryParams = {
      market: opts.market,
      direction: opts.direction,
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/get_positions_sorted_by_risk', routeParams, queryParams)
    const response = await request.get()
    return response.data as ResultsPaged<RestModels.Position>
  }

  async getPositionsBySize(opts: GetPositionsLargestOpts): Promise<ResultsPaged<RestModels.Position>> {
    const queryParams = {
      market: opts.market,
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/get_positions_sorted_by_size', routeParams, queryParams)
    const response = await request.get()
    return response.data as ResultsPaged<RestModels.Position>
  }

  // 404, also not in switcheo-chain
  async getAMMRewardPercentage(): Promise<GetAMMRewardPercentageResponse> {
    const request = this.apiManager.path('markets/get_amm_reward_percentage')
    const response = await request.get()
    return response.data as GetAMMRewardPercentageResponse
  }

  async getCandlesticks(opts: GetCandlesticksOpts): Promise<GetCandlesticksResponse> {
    const queryParams = {
      market: opts.market,
      resolution: opts.resolution,
      from: opts.from,
      to: opts.to
    }
    const routeParams = {}
    const request = this.apiManager.path('markets/candlesticks', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetCandlesticksResponse
  }

  // Staking

  async getStakingPool(): Promise<GetStakingPoolResponse> {
    const request = this.apiManager.path('staking/get_staking_pool')
    const response = await request.get()
    return response.data as GetStakingPoolResponse
  }

  async getDelegatorDelegations(opts: GetDelegatorDelegationsOpts): Promise<GetDelegatorDelegationsResponse> {
    const routeParams = { address: opts.address }
    const request = this.apiManager.path('staking/delegator_delegations', routeParams)
    const response = await request.get()
    return response.data as GetDelegatorDelegationsResponse
  }

  async getDelegatorUnbondingDelegations(opts: GetDelegatorUnbondingDelegationsOpts): Promise<GetDelegatorUnbondingDelegationsResponse> {
    const routeParams = { address: opts.address }
    const request = this.apiManager.path('staking/delegator_unbonding_delegations', routeParams)
    const response = await request.get()
    const data = response.data;

    if (data.result?.length) {
      data.result = data.result.map((item) => ({
        ...item,
        entries: item.entries?.map((entry) => ({
          ...entry,
          creation_height: parseInt(entry.creation_height),
          initial_balance: bnOrZero(entry.initial_balance),
          balance: bnOrZero(entry.balance),
          completion_time: parseCosmosDate(entry.completion_time),
        }) as RestModels.UnbondingEntry)
      }))
    }

    return response.data as GetDelegatorUnbondingDelegationsResponse
  }

  async getDelegatorRedelegations(opts: GetDelegatorRedelegationsOpts): Promise<GetDelegatorRedelegationsResponse> {
    const queryParams = {
      delegator: opts.delegator,
    }
    const routeParams = {}
    const request = this.apiManager.path('staking/redelegations', routeParams, queryParams)
    const response = await request.get()
    const data = response.data;

    if (data.result?.length) {
      data.result = data.result.map((item) => ({
        ...item,
        entries: item.entries?.map((entry) => ({
          ...entry,
          creation_height: parseInt(entry.creation_height),
          initial_balance: bnOrZero(entry.initial_balance),
          balance: bnOrZero(entry.balance),
          completion_time: parseCosmosDate(entry.completion_time),
          shares_dst: bnOrZero(entry.shares_dst),
        }) as RestModels.DelegationEntry)
      }))
    }

    return response.data as GetDelegatorRedelegationsResponse
  }

  async getDelegatorDelegationRewards(opts: GetDelegatorDelegationRewardsOpts): Promise<GetDelegatorDelegationRewardsResponse> {
    const routeParams = { address: opts.address }
    const request = this.apiManager.path('staking/delegation_rewards', routeParams)
    const response = await request.get()
    return response.data as GetDelegatorDelegationRewardsResponse
  }

  async getStakedPoolTokenInfo(opts: GetStakedPoolTokenOpts): Promise<GetStakedPoolTokenResponse> {
    const queryParams = {
      pool_id: opts.pool_id,
      account: opts.account,
    }
    const routeParams = {}
    const request = this.apiManager.path('staking/get_staked_pool_token_info', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetStakedPoolTokenResponse
  }

  async getInflationStartTime(): Promise<RestModels.BlockHeight> {
    const request = this.apiManager.path('staking/get_inflation_start_time')
    const response = await request.get()
    return response.data as RestModels.BlockHeight
  }

  async getWeeklyRewards(): Promise<BigNumber> {
    const startTime: RestModels.BlockHeight = await this.getInflationStartTime()
    const WEEKLY_DECAY = new BigNumber(0.9835)
    const MIN_RATE = new BigNumber(0.0003)
    const INITIAL_SUPPLY = new BigNumber(1000000000)
    const SECONDS_IN_A_WEEK = new BigNumber(604800)

    const difference = new BigNumber(dayjs().diff(dayjs(startTime.block_time), 'second'))
    const currentWeek = difference.div(SECONDS_IN_A_WEEK).dp(0, BigNumber.ROUND_DOWN)

    let inflationRate = WEEKLY_DECAY.pow(currentWeek)
    if (inflationRate.lt(MIN_RATE)) {
      inflationRate = MIN_RATE
    }
    return INITIAL_SUPPLY.div(52).times(inflationRate)
  }

  // Validators

  async getAllValidators(): Promise<RestModels.Validator[]> {
    const request = this.apiManager.path('validators/get_all')
    const response = await request.get()
    return response.data as RestModels.Validator[]
  }

  async getValidatorDelegations(opts: ListValidatorDelegationsOpts): Promise<ListValidatorDelegationsResponse> {
    const routeParams = { validator: opts.validator }
    const request = this.apiManager.path('validators/delegations', routeParams)
    const response = await request.get()
    return response.data as ListValidatorDelegationsResponse
  }

  async getStakingValidators(): Promise<GetStakingValidatorsResponse> {
    const request = this.apiManager.path('validators/get_staking_validators')
    const response = await request.get()
    return response.data as GetStakingValidatorsResponse
  }

  async getUnbondingStakingValidators(): Promise<GetUnbondingStakingValidatorsResponse> {
    const queryParams = {
      status: "unbonding",
    }
    const routeParams = {}
    const request = this.apiManager.path('validators/get_staking_validators', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetUnbondingStakingValidatorsResponse
  }

  async getUnbondedStakingValidators(): Promise<GetUnbondedStakingValidatorsResponse> {
    const queryParams = {
      status: "unbonded",
    }
    const routeParams = {}
    const request = this.apiManager.path('validators/get_staking_validators', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetUnbondedStakingValidatorsResponse
  }

  async getDistributionParams(): Promise<GetDistributionParamsResponse> {
    const request = this.apiManager.path('distribution/parameters')
    const response = await request.get()
    const data = response.data
    data.result = {
      ...data.result,
      community_tax: bnOrZero(data.result.community_tax),
      base_proposer_reward: bnOrZero(data.result.base_proposer_reward),
      bonus_proposer_reward: bnOrZero(data.result.bonus_proposer_reward),
      liquidity_provider_reward: bnOrZero(data.result.liquidity_provider_reward),
    }
    return data as GetDistributionParamsResponse
  }

  async getSlashingParams(): Promise<GetSlashingParamsResponse> {
    const request = this.apiManager.path('slashing/parameters')
    const response = await request.get()
    const data = response.data
    data.result = {
      signed_blocks_window: bnOrZero(data.result.signed_blocks_window).toNumber(),
      min_signed_per_window: bnOrZero(data.result.min_signed_per_window).toNumber(),
      downtime_jail_duration: bnOrZero(data.result.downtime_jail_duration).toNumber(),
      slash_fraction_double_sign: bnOrZero(data.result.slash_fraction_double_sign).toNumber(),
      slash_fraction_downtime: bnOrZero(data.result.slash_fraction_downtime).toNumber(),
    }
    return data as GetSlashingParamsResponse
  }

  async getSlashingSigningInfos(): Promise<GetSlashingSigningInfoResponse> {
    const request = this.apiManager.path('slashing/signing_infos')
    const response = await request.get()
    const data = response.data
    for (const info of data.result) {
      info.start_height = parseInt(info.start_height)
      info.index_offset = parseInt(info.index_offset)
      info.missed_blocks_counter = parseInt(info.missed_blocks_counter)
      info.jailed_until = parseCosmosDate(info.jailed_until)
    }

    return data as GetSlashingSigningInfoResponse
  }

  async getGovParamsDeposit(): Promise<GovDepositParamsResponse> {
    const request = this.apiManager.path('gov/parameters/deposit')
    const response = await request.get()
    return response.data as GovDepositParamsResponse
  }

  async getGovParamsTally(): Promise<GovTallyParamsResponse> {
    const request = this.apiManager.path('gov/parameters/tallying')
    const response = await request.get()
    return response.data as GovTallyParamsResponse
  }

  async listGovProposals(opts: ListGovProposalOpts = {}): Promise<GovListProposalResponse> {
    const request = this.apiManager.path('gov/proposals/list', {}, opts)
    const response = await request.get()
    const data = response.data
    for (const proposal of data.result) {
      proposal.final_tally_result = {
        yes: bnOrZero(proposal.final_tally_result.yes),
        abstain: bnOrZero(proposal.final_tally_result.abstain),
        no: bnOrZero(proposal.final_tally_result.no),
        no_with_veto: bnOrZero(proposal.final_tally_result.no_with_veto),
      }
      proposal.submit_time = parseCosmosDate(proposal.submit_time)
      proposal.deposit_end_time = parseCosmosDate(proposal.deposit_end_time)
      proposal.voting_start_time = parseCosmosDate(proposal.voting_start_time)
      proposal.voting_end_time = parseCosmosDate(proposal.voting_end_time)
    }

    return data as GovListProposalResponse
  }

  async getGovProposal(opts: GetGovProposalOpts): Promise<GovGetProposalResponse> {
    const request = this.apiManager.path('gov/proposals/detail', opts)
    const response = await request.get()
    const data = response.data
    const proposal = data.result;
    proposal.final_tally_result = {
      yes: bnOrZero(proposal.final_tally_result.yes),
      abstain: bnOrZero(proposal.final_tally_result.abstain),
      no: bnOrZero(proposal.final_tally_result.no),
      no_with_veto: bnOrZero(proposal.final_tally_result.no_with_veto),
    }
    proposal.submit_time = parseCosmosDate(proposal.submit_time)
    proposal.deposit_end_time = parseCosmosDate(proposal.deposit_end_time)
    proposal.voting_start_time = parseCosmosDate(proposal.voting_start_time)
    proposal.voting_end_time = parseCosmosDate(proposal.voting_end_time)

    return data as GovGetProposalResponse
  }

  async getGovProposer(opts: GetGovProposalOpts): Promise<GovProposerResponse> {
    const request = this.apiManager.path('gov/proposals/proposer', opts)
    const response = await request.get()
    return response.data as GovProposerResponse
  }

  async getGovLiveTally(opts: GetGovProposalOpts): Promise<GovLiveTallyResponse> {
    const request = this.apiManager.path('gov/proposals/tally', opts)
    const response = await request.get()
    const data = response.data

    data.result = {
      yes: bnOrZero(data.result.yes),
      abstain: bnOrZero(data.result.abstain),
      no: bnOrZero(data.result.no),
      no_with_veto: bnOrZero(data.result.no_with_veto),
    }

    return data as GovLiveTallyResponse
  }

  async getLatestBlock(): Promise<RestModels.CosmosBlock> {
    const request = this.apiManager.path("tradehub/blocks/latest")
    const response = await request.get();

    return response.data as RestModels.CosmosBlock;
  }

  async getTotalSupply(opts: GetTotalSupplyOpts): Promise<CosmosResponse<string>> {
    const { denom } = opts;
    const request = this.apiManager.path("tradehub/supply", { denom })
    const response = await request.get();

    return response.data as CosmosResponse<string>;
  }

  async getSWTHSupply(): Promise<BigNumber> {
    const tradehubSupplyRaw = await this.getTotalSupply({ denom: "swth" });
    const bscSupply = await this.fetchSupply(`https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=0x250b211ee44459dad5cd3bca803dd6a7ecb5d46c&apikey=CBYSNW36IW65MPVJWD1B92P5TED52DM1PR`);
    const ethSupply = await this.fetchSupply('https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0xb4371da53140417cbb3362055374b10d97e420bb&apikey=M56BUJAR279SGEEZIGYE94C4R1EB3RBYMY');
    return bnOrZero(tradehubSupplyRaw.result).plus(bscSupply).plus(ethSupply);
  }

  async getCoinMapping(): Promise<CosmosResponse<SimpleMap<string>>> {
    const request = this.apiManager.path("tradehub/coin/mapping")
    const response = await request.get();

    return response.data as CosmosResponse<SimpleMap<string>>;
  }

  private async fetchSupply(url: string): Promise<BigNumber> {
    try {
      const response = await fetch(url);
      const supply = await response.json();
      return bnOrZero(supply.result);
    } catch (error) {
      console.error(error);
      return BN_ZERO;
    }
  }
}

export default APIClient
