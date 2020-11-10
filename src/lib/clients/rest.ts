import { BigNumber } from 'bignumber.js'
import { ethers } from 'ethers'
import fetch from '../utils/fetch'
import { wallet as neonWallet, u as neonUtils } from "@cityofzion/neon-js"

import { getNetwork } from '../config'
import { WalletClient } from './wallet'
import { Blockchain } from '../constants'

import * as types from '../types'


export enum Direction {
  long = 'long',
  short = 'short',
}

// TODO: include optional params such as pagination and limit
// TODO: response typings
// TODO: support all POST methods

export interface REST {
  // public
  checkUsername(params: types.UsernameGetterParams): Promise<boolean>
  getAccount(params?: types.AddressOnlyGetterParams): Promise<object>
  getAccountTrades(params: types.GetTradesGetterParams): Promise<Array<object>>
  getActiveWallets(params: types.TokenOnlyGetterParams): Promise<string>
  getAllValidators(): Promise<Array<object>>
  getAMMRewardPercentage(): Promise<null | types.GetAMMRewardPercentageResponse>
  getAverageBlocktime(): Promise<string>
  getBlocks(params?: types.PageOnlyGetterParams): Promise<Array<object>>
  getInsuranceFundBalance(): Promise<Array<object>>
  getLeaderboard(params: types.MarketOnlyGetterParams): Promise<Array<object>>
  getLeverage(params: types.MarketAndAddressGetterParams): Promise<object>
  getLiquidityPools(): Promise<null | types.GetLiquidityPoolsResponse>
  getLiquidationTrades(): Promise<Array<object>>
  getMarkets(): Promise<Array<object>>
  getMarket(params: types.MarketOnlyGetterParams): Promise<object>
  getMarketStats(params?: types.MarketOnlyGetterParams): Promise<Array<object>>
  getNodes(): Promise<Array<object>>
  getOrder(params: types.GetIDOnlyGetterParams): Promise<object>
  getOrders(params: types.GetOrdersGetterParams): Promise<Array<object>>
  getOpenOrders(params: types.GetOrdersGetterParams): Promise<Array<object>>
  getOrderBook(params: types.MarketOnlyGetterParams): Promise<types.OrderBook>
  getProfile(params?: types.AddressOnlyGetterParams): Promise<object>
  getPrices(params: types.MarketOnlyGetterParams): Promise<object>
  getRichList(params: types.TokenOnlyGetterParams): Promise<Array<object>>
  getTotalBalances(): Promise<Array<object>>
  getTrades(params: types.GetTradesGetterParams): Promise<Array<object>>
  getToken(params: types.TokenOnlyGetterParams): Promise<any>
  getTokens(): Promise<any>
  getTx(params: types.GetIDOnlyGetterParams): Promise<object>
  getTransfers(params?: types.AddressOnlyGetterParams): Promise<object>
  getTxs(): Promise<Array<object>>
  getTxLog(params: types.GetIDOnlyGetterParams): Promise<object>
  getTxTypes(): Promise<Array<string>>
  getPositionsWithHighestPnL(params: types.MarketOnlyGetterParams): Promise<Array<object>>
  getPositionsCloseToLiquidation(params: types.GetPositionsCloseToLiquidationParams): Promise<Array<object>>
  getPositionsLargest(params: types.MarketOnlyGetterParams): Promise<Array<object>>
  getPosition(params: types.MarketAndAddressGetterParams): Promise<object>
  getPositions(params?: types.AddressOnlyGetterParams): Promise<Array<object>>
  getWalletBalance(params?: types.AddressOnlyGetterParams): Promise<types.WalletBalance>

  // cosmos
  getStakingValidators(): Promise<any>
  getUnbondingStakingValidators(): Promise<any>
  getUnbondedStakingValidators(): Promise<any>
  getStakingPool(): Promise<any>
  getValidatorDelegations(params?: types.AddressOnlyGetterParams): Promise<any>
  getDelegatorDelegations(params?: types.AddressOnlyGetterParams): Promise<any>
  getDelegatorUnbondingDelegations(params?: types.AddressOnlyGetterParams): Promise<any>
  getDelegatorRedelegations(params?: types.AddressOnlyGetterParams): Promise<any>
  getAllDelegatorDelegations(params?: types.AddressOnlyGetterParams): Promise<any>
  getDelegatorDelegationRewards(params?: types.AddressOnlyGetterParams): Promise<any>

  // private
  send(msg: types.SendTokensMsg, options?: types.Options): Promise<any>
  createOrder(msg: types.CreateOrderMsg, options?: types.Options): Promise<any>
  createOrders(msgs: types.CreateOrderMsg[], options?: types.Options): Promise<any>
  cancelOrder(msg: types.CancelOrderMsg, options?: types.Options): Promise<any>
  cancelOrders(msgs: types.CancelOrderMsg[], options?: types.Options): Promise<any>
  editOrder(msg: types.EditOrderMsg, options?: types.Options): Promise<any>
  editOrders(msgs: types.EditOrderMsg[], options?: types.Options): Promise<any>
  cancelAll(msg: types.CancelAllMsg, options?: types.Options): Promise<any>
  updateProfile(msg: types.UpdateProfileMsg, options?: types.Options): Promise<any>
  setLeverage(msg: types.SetLeverageMsg, options?: types.Options): Promise<any>
  setLeverages(msgs: types.SetLeverageMsg[], options?: types.Options): Promise<any>
  createMarket(msg: types.CreateMarketMsg, options?: types.Options): Promise<any>
  createMarkets(msgs: types.CreateMarketMsg[], options?: types.Options): Promise<any>
  initiateSettlement(msg: types.InitiateSettlementMsg, options?: types.Options): Promise<any>
  initiateSettlements(msgs: types.InitiateSettlementMsg[], options?: types.Options): Promise<any>
  editMargin(params: types.EditMarginMsg, options?: types.Options): Promise<any>
  editMargins(msgs: types.EditMarginMsg[], options?: types.Options): Promise<any>
  createToken(msg: types.CreateTokenMsg, options?: types.Options): Promise<any>
  createTokens(msgs: types.CreateTokenMsg[], options?: types.Options): Promise<any>
  addLiquidity(msg: types.AddLiquidityMsg, options?: types.Options): Promise<any>
  removeLiquidity(msg: types.RemoveLiquidityMsg, options?: types.Options): Promise<any>
  createPool(msg: types.CreatePoolMsg, options?: types.Options): Promise<any>
  createPoolWithLiquidity(msg: types.CreatePoolWithLiquidityMsg, options?: types.Options): Promise<any>
  linkPool(msg: types.LinkPoolMsg, options?: types.Options): Promise<any>
  unlinkPool(msg: types.UnlinkPoolMsg, options?: types.Options): Promise<any>
  submitProposal<T>(msg: types.SubmitProposalMsg<T>, options?: types.Options): Promise<any>
  depositProposal(msg: types.DepositProposalMsg, options?: types.Options): Promise<any>
  voteProposal(msg: types.VoteProposalMsg, options?: types.Options): Promise<any>
  createOracle(msg: types.CreateOracleMsg, options?: types.Options): Promise<any>
  createVote(msg: types.CreateVoteMsg, options?: types.Options): Promise<any>
  createValidator(msg: types.CreateValidatorMsg, options?: types.Options): Promise<any>
  delegateTokens(msg: types.DelegateTokensMsg, options?: types.Options): Promise<any>
  unbondTokens(msg: types.BeginUnbondingTokensMsg, options?: types.Options): Promise<any>
  redelegateTokens(msg: types.BeginRedelegatingTokensMsg, options?: types.Options): Promise<any>
  withdrawDelegatorRewards(msg: types.WithdrawDelegatorRewardsMsg, options?: types.Options): Promise<any>
  withdrawAllDelegatorRewards(msg: types.WithdrawAllDelegatorRewardsParams, options?: types.Options): Promise<any>
  createSubAccount(msg: types.CreateSubAccountMsg, options?: types.Options): Promise<any>
  activateSubAccount(msg: types.ActivateSubAccountMsg, options?: types.Options): Promise<any>
  createWithdrawal(msg: types.CreateWithdrawalMsg, blockchain: string, options?: types.Options): Promise<any>
  mintTokens(msg: types.MintTokenRequest): Promise<any>
  setRewardsWeights(msg: types.SetRewardsWeightsMsg, options?: types.Options): Promise<any>
  setRewardCurve(msg: types.SetRewardCurveMsg, options?: types.Options): Promise<any>
  setCommitmentCurve(msg: types.SetCommitmentCurveMsg, options?: types.Options): Promise<any>
  stakePoolToken(msg: types.StakePoolTokenMsg, options?: types.Options): Promise<any>
  unstakePoolToken(msg: types.UnstakePoolTokenMsg, options?: types.Options): Promise<any>
  claimPoolRewards(msg: types.ClaimPoolRewardsMsg, options?: types.Options): Promise<any>
}

export class RestClient implements REST {
  public readonly baseUrl: string
  public readonly cosmosBaseUrl: string
  public readonly wallet: WalletClient

  constructor(options: { network: string, wallet?: WalletClient }) {
    const { network, wallet } = options
    this.baseUrl = getNetwork(network).REST_URL
    this.cosmosBaseUrl = getNetwork(network).COSMOS_URL
    this.wallet = wallet
  }

  protected async fetchJson(relativeUrl: string): Promise<any> {
    const url: string = `${this.baseUrl}${relativeUrl}`
    const res = await fetch(url)
    const json = await res.json()
    return json
  }

  protected async fetchCosmosJson(relativeUrl: string): Promise<any> {
    const url: string = `${this.cosmosBaseUrl}${relativeUrl}`
    const res = await fetch(url)
    const json = await res.json()
    return json
  }

  //
  // PUBLIC METHODS
  //

  // Account

  public async getAccount(params?: types.AddressOnlyGetterParams) {
    let address = ''
    if (!params) {
      if (!this.wallet) {
        throw new Error('get_account: missing address param')
      }
      address = this.wallet.pubKeyBech32
    } else {
      address = params.address
    }
    return this.fetchJson(`/get_account?account=${address}`)
  }

  public async checkUsername(params: types.UsernameGetterParams) {
    const { username } = params
    return this.fetchJson(`/username_check?username=${username}`)
  }

  public async getProfile(params?: types.AddressOnlyGetterParams) {
    let address = ''
    if (!params) {
      if (!this.wallet) {
        throw new Error('get_account: missing address param')
      }
      address = this.wallet.pubKeyBech32
    } else {
      address = params.address
    }
    return this.fetchJson(`/get_profile?account=${address}`)
  }

  public async getPosition(params: types.MarketAndAddressGetterParams) {
    if (!params.address && !this.wallet) {
      throw new Error('get_account: missing address param')
    }
    let address = ''
    if (!params.address) {
      address = this.wallet.pubKeyBech32
    } else {
      address = params.address
    }
    return this.fetchJson(`/get_position?account=${address}&market=${params.market}`)
  }

  public async getPositions(params?: types.AddressOnlyGetterParams) {
    let address = ''
    if (!params) {
      if (!this.wallet) {
        throw new Error('get_account: missing address param')
      }
      address = this.wallet.pubKeyBech32
    } else {
      address = params.address
    }
    return this.fetchJson(`/get_position?account=${address}`)
  }

  public async getLeverage(params: types.MarketAndAddressGetterParams) {
    if (!params.address && !this.wallet) {
      throw new Error('get_account: missing address param')
    }
    let address = ''
    if (!params.address) {
      address = this.wallet.pubKeyBech32
    } else {
      address = params.address
    }
    return this.fetchJson(`/get_leverage?account=${address}&market=${params.market}`)
  }

  public async getOrder(params: types.GetIDOnlyGetterParams) {
    const { id } = params
    return this.fetchJson(`/get_order?order_id=${id}`)
  }

  public async getOrders(params: types.GetOrdersGetterParams) {
    const {
      address,
      market,
      limit,
      beforeId,
      afterId,
      status,
      orderType,
    } = params

    let url = '/get_orders?'

    if (!address) {
      if (!this.wallet) {
        url += `address=${this.wallet.pubKeyBech32}&`
      }
    } else {
      url += `address=${address}&`
    }

    if (market) {
      url += `market=${market}&`
    }
    if (limit) {
      url += `limit=${limit}&`
    }
    if (beforeId) {
      url += `before_id=${beforeId}&`
    }
    if (afterId) {
      url += `after_id=${afterId}&`
    }
    if (status) {
      url += `status=${status}&`
    }
    if (orderType) {
      url += `order_type=${orderType}&`
    }
    return this.fetchJson(url)
  }

  public async getOpenOrders(params: types.GetOrdersGetterParams) {
    const {
      address,
      market,
      limit,
      beforeId,
      afterId,
      orderType,
    } = params

    let url = '/get_orders?'

    if (address) {
      url += `account=${address}&`
    } else {
      url += `account=${this.wallet.pubKeyBech32}&`
    }

    url += `order_status=open&`

    if (market) {
      url += `market=${market}&`
    }
    if (limit) {
      url += `limit=${limit}&`
    }
    if (beforeId) {
      url += `before_id=${beforeId}&`
    }
    if (afterId) {
      url += `after_id=${afterId}&`
    }
    if (orderType) {
      url += `order_type=${orderType}&`
    }
    return this.fetchJson(url)
  }

  public async getAccountTrades(params: types.GetTradesGetterParams) {
    const {
      address,
      market,
      limit,
      beforeId,
      afterId,
    } = params

    let url = '/get_trades_by_account?'

    if (!address && !this.wallet) {
      throw new Error('get_account: missing address param')
    }
    if (!address) {
      url += `account=${this.wallet.pubKeyBech32}&`
    } else {
      url += `account=${address}&`
    }
    if (market) {
      url += `market=${market}&`
    }
    if (limit) {
      url += `limit=${limit}&`
    }
    if (beforeId) {
      url += `before_id=${beforeId}&`
    }
    if (afterId) {
      url += `after_id=${afterId}&`
    }

    return this.fetchJson(url)
  }

  public async getNodes() {
    return this.fetchJson('/monitor')
  }

  public async getWalletBalance(params?: types.AddressOnlyGetterParams) {
    let address = ''
    if (!params) {
      if (!this.wallet) {
        throw new Error('get_account: missing address param')
      }
      address = this.wallet.pubKeyBech32
    } else {
      address = params.address
    }
    return this.fetchJson(`/get_balance?account=${address}`)
  }

  // Market Info

  public async getMarket(params: types.MarketOnlyGetterParams) {
    return this.fetchJson(`/get_market?market=${params.market}`)
  }

  public async getOrderBook(params: types.MarketOnlyGetterParams) {
    return this.fetchJson(`/get_orderbook?market=${params.market}`)
  }

  public async getMarkets() {
    return this.fetchJson(`/get_markets`)
  }

  public async getPrices(params: types.MarketOnlyGetterParams) {
    return this.fetchJson(`/get_prices?market=${params.market}`)
  }

  public async getMarketStats(params?: types.MarketOnlyGetterParams) {
    let url = '/get_market_stats'
    if (params) {
      url = url + `?market=${params.market}`
    }
    return this.fetchJson(url)
  }

  public async getInsuranceFundBalance() {
    return this.fetchJson(`/get_insurance_balance`)
  }

  public async getTrades(options: types.GetTradesGetterParams) {
    const {
      address,
      market,
      limit,
      beforeId,
      afterId,
    } = options

    let url = '/get_trades?'


    if (!address) {
      if (this.wallet) {
        url += `account=${this.wallet.pubKeyBech32}&`
      }
    } else {
      url += `account=${address}&`
    }
    if (market) {
      url += `market=${market}&`
    }
    if (limit) {
      url += `limit=${limit}&`
    }
    if (beforeId) {
      url += `before_id=${beforeId}&`
    }
    if (afterId) {
      url += `after_id=${afterId}&`
    }

    return this.fetchJson(url)
  }

  public async getLiquidationTrades() {
    return this.fetchJson(`/get_liquidations`)
  }

  public async getLiquidityPools(): Promise<null | types.GetLiquidityPoolsResponse> {
    return this.fetchJson(`/get_liquidity_pools`)
  }

  // Leaderboard

  public async getLeaderboard(params: types.MarketOnlyGetterParams) {
    return this.fetchJson(`/get_top_r_profits?market=${params.market}`)
  }

  public async getPositionsWithHighestPnL(params: types.MarketOnlyGetterParams) {
    return this.fetchJson(`/get_positions_sorted_by_pnl1?market=${params.market}`)
  }

  public async getPositionsCloseToLiquidation(params: types.GetPositionsCloseToLiquidationParams) {
    const { market, direction } = params
    return this.fetchJson(`/get_positions_sorted_by_risk?market=${market}&direction=${direction}`)
  }

  public async getPositionsLargest(params: types.MarketOnlyGetterParams) {
    const { market } = params
    return this.fetchJson(`/get_positions_sorted_by_size?market=${market}`)
  }

  // Blockchain Stats

  public async getActiveWallets(params: types.TokenOnlyGetterParams) {
    const { token } = params
    return this.fetchJson(`/get_active_wallets?token=${token}`)
  }

  public async getAllValidators() {
    return this.fetchJson(`/get_all_validators`)
  }

  public async getTx(params: types.GetIDOnlyGetterParams) {
    const { id } = params
    return this.fetchJson(`/get_transaction?hash=${id}`)
  }

  public async getTxs() {
    return this.fetchJson(`/get_transactions`)
  }

  public async getTxLog(params: types.GetIDOnlyGetterParams) {
    const { id } = params
    return this.fetchJson(`/get_tx_log?hash=${id}`)
  }

  public async getTxTypes() {
    return this.fetchJson(`/get_transaction_types`)
  }

  public async getTotalBalances() {
    return this.fetchJson(`/get_total_balances`)
  }

  public async getToken(params: types.TokenOnlyGetterParams) {
    const { token } = params
    return this.fetchJson(`/get_token?token=${token}`)
  }

  public async getTokens() {
    return this.fetchJson(`/get_tokens`)
  }

  public async getRichList(params: types.TokenOnlyGetterParams) {
    const { token } = params
    return this.fetchJson(`/get_rich_list?=token=${token}`)
  }

  public async getAverageBlocktime() {
    return this.fetchJson(`/get_block_time`)
  }

  public async getBlocks(params?: types.PageOnlyGetterParams) {
    let url = '/get_blocks'
    if (params) {
      url = url + `?page=${params.page}`
    }
    return this.fetchJson(url)
  }

  public async getAMMRewardPercentage(): Promise<null | types.GetAMMRewardPercentageResponse> {
    return this.fetchJson('/get_amm_reward_percentage')
  }

  public async getTransfers(params?: types.AddressOnlyGetterParams) {
    let address = ''
    if (!params) {
      if (!this.wallet) {
        throw new Error('get_account: missing address param')
      }
      address = this.wallet.pubKeyBech32
    } else {
      address = params.address
    }
    return this.fetchJson(`/get_external_transfers?account=${address}`)
  }

  // cosmos
  public async getStakingValidators(): Promise<any> {
    return this.fetchCosmosJson(`/staking/validators`)
  }

  public async getUnbondingStakingValidators(): Promise<any> {
    return this.fetchCosmosJson(`/staking/validators?status=unbonding`)
  }

  public async getUnbondedStakingValidators(): Promise<any> {
    return this.fetchCosmosJson(`/staking/validators?status=unbonded`)
  }

  public async getStakingPool(): Promise<any> {
    return this.fetchCosmosJson(`/staking/pool`)
  }

  public async getValidatorDelegations(params: types.AddressOnlyGetterParams): Promise<any> {
    let address = ''
    if (!params) {
      if (!this.wallet) {
        throw new Error('get_account: missing address param')
      }
      address = this.wallet.pubKeyBech32
    } else {
      address = params.address
    }
    return this.fetchCosmosJson(`/staking/validators/${address}/delegations`)
  }

  public async getDelegatorDelegations(params: types.AddressOnlyGetterParams): Promise<any> {
    let address = ''
    if (!params) {
      if (!this.wallet) {
        throw new Error('get_account: missing address param')
      }
      address = this.wallet.pubKeyBech32
    } else {
      address = params.address
    }
    return this.fetchCosmosJson(`/staking/delegators/${address}/delegations`)
  }

  public async getDelegatorUnbondingDelegations(params?: types.AddressOnlyGetterParams): Promise<any> {
    let address = ''
    if (!params) {
      if (!this.wallet) {
        throw new Error('get_account: missing address param')
      }
      address = this.wallet.pubKeyBech32
    } else {
      address = params.address
    }
    return this.fetchCosmosJson(`/staking/delegators/${address}/unbonding_delegations`)
  }

  public async getDelegatorRedelegations(params?: types.AddressOnlyGetterParams): Promise<any> {
    let address = ''
    if (!params) {
      if (!this.wallet) {
        throw new Error('get_account: missing address param')
      }
      address = this.wallet.pubKeyBech32
    } else {
      address = params.address
    }
    return this.fetchCosmosJson(`/staking/redelegations?delegator=${address}`)
  }

  public async getAllDelegatorDelegations(params?: types.AddressOnlyGetterParams): Promise<any> {
    const promises = [
      this.getDelegatorDelegations(params),
      this.getDelegatorUnbondingDelegations(params),
      this.getDelegatorRedelegations(params),
    ]
    return Promise.all(promises).then((responses) => {
      return {
        delegations: responses[0],
        unbonding: responses[1],
        redelegations: responses[2],
      }
    })
  }

  public async getDelegatorDelegationRewards(params?: types.AddressOnlyGetterParams): Promise<any> {
    let address = ''
    if (!params) {
      if (!this.wallet) {
        throw new Error('get_account: missing address param')
      }
      address = this.wallet.pubKeyBech32
    } else {
      address = params.address
    }
    return this.fetchCosmosJson(`/distribution/delegators/${address}/rewards`)
  }

  // PRIVATE METHODS
  public async createOrder(msg: types.CreateOrderMsg, options?: types.Options) {
    return this.createOrders([msg], options)
  }

  public async createOrders(msgs: types.CreateOrderMsg[], options?: types.Options) {
    const address = this.wallet.pubKeyBech32
    msgs = msgs.map((msg, i) => {
      if (!msg.originator) msg.originator = address
      if (msg.type === undefined) {
        console.warn(`msgs[${i}].type should be set, defaulting to limit`)
        msg.type = 'limit'
      }
      if (msg.is_post_only === undefined) msg.is_post_only = false
      if (msg.is_reduce_only === undefined) msg.is_reduce_only = false
      return msg
    })
    return this.wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.CREATE_ORDER_MSG_TYPE), options)
  }

  public async cancelOrder(msg: types.CancelOrderMsg, options?: types.Options) {
    return this.cancelOrders([msg], options)
  }

  public async cancelOrders(msgs: types.CancelOrderMsg[], options?: types.Options) {
    const address = this.wallet.pubKeyBech32
    msgs = msgs.map(msg => {
      if (!msg.originator) msg.originator = address
      return msg
    })
    return this.wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.CANCEL_ORDER_MSG_TYPE), options)
  }

  public async editOrder(msg: types.EditOrderMsg, options?: types.Options) {
    return this.editOrders([msg], options)
  }

  public async editOrders(msgs: types.EditOrderMsg[], options?: types.Options) {
    const address = this.wallet.pubKeyBech32
    msgs = msgs.map(msg => {
      if (!msg.originator) msg.originator = address
      return msg
    })
    return this.wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.EDIT_ORDER_MSG_TYPE), options)
  }

  public async cancelAll(msg: types.CancelAllMsg, options?: types.Options) {
    if (!msg.originator) msg.originator = this.wallet.pubKeyBech32
    return this.wallet.signAndBroadcast([msg], [types.CANCEL_ALL_MSG_TYPE], options)
  }

  public async send(msg: types.SendTokensMsg, options?: types.Options) {
    if (!msg.from_address) {
      msg.from_address = this.wallet.pubKeyBech32
    }
    return this.wallet.signAndBroadcast([msg], [types.SEND_TOKENS_TYPE], options)
  }

  public async updateProfile(msg: types.UpdateProfileMsg, options?: types.Options) {
    if (!msg.Originator) msg.Originator = this.wallet.pubKeyBech32
    return this.wallet.signAndBroadcast([msg], [types.UPDATE_PROFILE_MSG_TYPE], options)
  }

  public async setLeverage(msg: types.SetLeverageMsg, options?: types.Options) {
    return this.setLeverages([msg], options)
  }

  public async setLeverages(msgs: types.SetLeverageMsg[], options?: types.Options) {
    const address = this.wallet.pubKeyBech32
    msgs = msgs.map(msg => {
      if (!msg.originator) msg.originator = address
      return msg
    })
    return this.wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.SET_LEVERAGE_MSG_TYPE), options)
  }

  public async createMarket(msg: types.CreateMarketMsg, options?: types.Options) {
    return this.createMarkets([msg], options)
  }

  public async createMarkets(msgs: types.CreateMarketMsg[], options?: types.Options) {
    const address = this.wallet.pubKeyBech32
    msgs = msgs.map(msg => {
      // msg.TickSize = new BigNumber(msg.TickSize).toFixed(18)
      if (!msg.originator) msg.originator = address
      return msg
    })
    return this.wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.ADD_MARKET_MSG_TYPE), options)
  }

  public async initiateSettlement(msg: types.InitiateSettlementMsg, options?: types.Options) {
    return this.initiateSettlements([msg], options)
  }

  public async initiateSettlements(msgs: types.InitiateSettlementMsg[], options?: types.Options) {
    const address = this.wallet.pubKeyBech32
    msgs = msgs.map(msg => {
      if (!msg.originator) msg.originator = address
      return msg
    })
    return this.wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.INITIATE_SETTLEMENT_MSG_TYPE), options)
  }

  public async editMargin(params: types.EditMarginMsg, options?: types.Options) {
    return this.editMargins([params], options)
  }

  public async editMargins(msgs: types.EditMarginMsg[], options?: types.Options) {
    msgs = msgs.map(msg => {
      if (!msg.originator) msg.originator = this.wallet.pubKeyBech32
      return msg
    })
    return this.wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.EDIT_MARGIN_MSG_TYPE), options)
  }

  public async createToken(msg: types.CreateTokenMsg, options?: types.Options) {
    return this.createTokens([msg], options)
  }

  public async createTokens(msgs: types.CreateTokenMsg[], options?: types.Options) {
    const address = this.wallet.pubKeyBech32
    msgs = msgs.map(msg => {
      if (!msg.originator) msg.originator = address
      return msg
    })
    console.log(this.wallet, this.wallet.signAndBroadcast)

    return this.wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.CREATE_TOKEN_MSG_TYPE), options)
  }

  public async mintMultipleTestnetTokens(params: types.MintParams) {
    const { toAddress, mint } = params
    const promises = mint.map((v: { denom: string, amount: string }) => {
      return this.mintTestnetTokens({
        to_address: toAddress,
        amount: new BigNumber(v.amount).toFixed(18),
        denom: v.denom,
      })
    })
    return Promise.all(promises)
  }

  public async mintTestnetTokens(msg: types.MintTokenMsg, options?: types.Options) {
    if (!msg.originator) msg.originator = this.wallet.pubKeyBech32
    return this.wallet.signAndBroadcast([msg], [types.MINT_TOKEN_MSG_TYPE], options)
  }

  public async addLiquidity(msg: types.AddLiquidityMsg, options?: types.Options) {
    if (!msg.originator) {
      msg.originator = this.wallet.pubKeyBech32
    }
    return this.wallet.signAndBroadcast([msg], [types.ADD_LIQUIDITY_MSG_TYPE], options)
  }

  public async removeLiquidity(msg: types.RemoveLiquidityMsg, options?: types.Options) {
    if (!msg.originator) {
      msg.originator = this.wallet.pubKeyBech32
    }
    return this.wallet.signAndBroadcast([msg], [types.REMOVE_LIQUIDITY_MSG_TYPE], options)
  }

  public async createPool(msg: types.CreatePoolMsg, options?: types.Options) {
    if (!msg.originator) {
      msg.originator = this.wallet.pubKeyBech32
    }
    return this.wallet.signAndBroadcast([msg], [types.CREATE_POOL_MSG_TYPE], options)
  }

  public async createPoolWithLiquidity(msg: types.CreatePoolWithLiquidityMsg, options?: types.Options) {
    if (!msg.originator) {
      msg.originator = this.wallet.pubKeyBech32
    }
    return this.wallet.signAndBroadcast([msg], [types.CREATE_POOL_WITH_LIQUIDITY_MSG_TYPE], options)
  }

  public async linkPool(msg: types.LinkPoolMsg, options?: types.Options) {
    if (!msg.originator) {
      msg.originator = this.wallet.pubKeyBech32
    }
    return this.wallet.signAndBroadcast([msg], [types.LINK_POOL_MSG_TYPE], options)
  }
  public async unlinkPool(msg: types.UnlinkPoolMsg, options?: types.Options) {
    if (!msg.originator) {
      msg.originator = this.wallet.pubKeyBech32
    }
    return this.wallet.signAndBroadcast([msg], [types.UNLINK_POOL_MSG_TYPE], options)
  }
  public async setRewardsWeights(msg: types.SetRewardsWeightsMsg, options?: types.Options) {
    if (!msg.originator) {
      msg.originator = this.wallet.pubKeyBech32
    }
    return this.wallet.signAndBroadcast([msg], [types.SET_REWARDS_WEIGHTS_MSG_TYPE], options)
  }

  public async setRewardCurve(msg: types.SetRewardCurveMsg, options?: types.Options) {
    if (!msg.originator) {
      msg.originator = this.wallet.pubKeyBech32
    }
    return this.wallet.signAndBroadcast([msg], [types.SET_REWARD_CURVE_MSG_TYPE], options)
  }

  public async setCommitmentCurve(msg: types.SetCommitmentCurveMsg, options?: types.Options) {
    if (!msg.originator) {
      msg.originator = this.wallet.pubKeyBech32
    }
    return this.wallet.signAndBroadcast([msg], [types.SET_COMMITMENT_CURVE_MSG_TYPE], options)
  }

  public async stakePoolToken(msg: types.StakePoolTokenMsg, options?: types.Options) {
    if (!msg.originator) {
      msg.originator = this.wallet.pubKeyBech32
    }
    return this.wallet.signAndBroadcast([msg], [types.STAKE_POOL_TOKEN_MSG_TYPE], options)
  }

  public async unstakePoolToken(msg: types.UnstakePoolTokenMsg, options?: types.Options) {
    if (!msg.originator) {
      msg.originator = this.wallet.pubKeyBech32
    }
    return this.wallet.signAndBroadcast([msg], [types.UNSTAKE_POOL_TOKEN_MSG_TYPE], options)
  }

  public async claimPoolRewards(msg: types.ClaimPoolRewardsMsg, options?: types.Options) {
    if (!msg.originator) {
      msg.originator = this.wallet.pubKeyBech32
    }
    return this.wallet.signAndBroadcast([msg], [types.CLAIM_POOL_REWARDS_MSG_TYPE], options)
  }

  public async submitProposal<T>(msg: types.SubmitProposalMsg<T>, options?: types.Options) {
    if (!msg.proposer) msg.proposer = this.wallet.pubKeyBech32
    return this.wallet.signAndBroadcast([msg], [types.SUBMIT_PROPOSAL_TYPE], options)
  }

  public async depositProposal(msg: types.DepositProposalMsg, options?: types.Options) {
    if (!msg.depositor) msg.depositor = this.wallet.pubKeyBech32
    return this.wallet.signAndBroadcast([msg], [types.DEPOSIT_PROPOSAL_TYPE], options)
  }

  public async voteProposal(msg: types.VoteProposalMsg, options?: types.Options) {
    if (!msg.voter) msg.voter = this.wallet.pubKeyBech32
    return this.wallet.signAndBroadcast([msg], [types.VOTE_PROPOSAL_TYPE], options)
  }

  public async createOracle(msg: types.CreateOracleMsg, options?: types.Options) {
    if (!msg.originator) msg.originator = this.wallet.pubKeyBech32
    return this.wallet.signAndBroadcast([msg], [types.CREATE_ORACLE_TYPE], options)
  }

  public async createVote(msg: types.CreateVoteMsg, options?: types.Options) {
    if (!msg.originator) msg.originator = this.wallet.pubKeyBech32
    return this.wallet.signAndBroadcast([msg], [types.CREATE_VOTE_TYPE], options)
  }

  public async createValidator(msg: types.CreateValidatorMsg, options?: types.Options) {
    return this.wallet.signAndBroadcast([msg], [types.CREATE_VALIDATOR_MSG_TYPE], options)
  }

  public async delegateTokens(msg: types.DelegateTokensMsg, options?: types.Options) {
    return this.wallet.signAndBroadcast([msg], [types.DELEGATE_TOKENS_MSG_TYPE], options)
  }

  public async unbondTokens(msg: types.BeginUnbondingTokensMsg, options?: types.Options) {
    return this.wallet.signAndBroadcast([msg], [types.BEGIN_UNBONDING_TOKENS_MSG_TYPE], options)
  }

  public async redelegateTokens(msg: types.BeginRedelegatingTokensMsg, options?: types.Options) {
    return this.wallet.signAndBroadcast([msg],
      [types.BEGIN_REDELEGATING_TOKENS_MSG_TYPE], options)
  }

  public async withdrawDelegatorRewards(msg: types.WithdrawDelegatorRewardsMsg, options?: types.Options) {
    return this.wallet.signAndBroadcast([msg],
      [types.WITHDRAW_DELEGATOR_REWARDS_MSG_TYPE], options)
  }

  public async withdrawAllDelegatorRewards(msg: types.WithdrawAllDelegatorRewardsParams, options?: types.Options) {
    const { validatorAddresses, delegatorAddress } = msg
    const messages: Array<types.WithdrawDelegatorRewardsMsg> =
      validatorAddresses.map((address: string) => (
        { validator_address: address, delegator_address: delegatorAddress }
      ))
    return this.wallet.signAndBroadcast(messages,
      Array(validatorAddresses.length).fill(types.WITHDRAW_DELEGATOR_REWARDS_MSG_TYPE), options)
  }

  public async createSubAccount(msg: types.CreateSubAccountMsg, options?: types.Options) {
    if (!msg.originator) msg.originator = this.wallet.pubKeyBech32
    return this.wallet.signAndBroadcast([msg], [types.CREATE_SUB_ACCOUNT_MSG_TYPE], options)
  }

  public async activateSubAccount(msg: types.ActivateSubAccountMsg, options?: types.Options) {
    if (!msg.originator) msg.originator = this.wallet.pubKeyBech32
    return this.wallet.signAndBroadcast([msg], [types.ACTIVATE_SUB_ACCOUNT_MSG_TYPE], options)
  }

  public async formatWithdrawalAddress(address, blockchain) {
    if (blockchain === Blockchain.Neo) {
      const isValidAddress = neonWallet.isAddress(address)
      if (!isValidAddress) {
        throw new Error('Invalid Neo address')
      }
      const scriptHash = neonWallet.getScriptHashFromAddress(address)
      // return the little endian version of the address
      return neonUtils.reverseHex(scriptHash)
    }

    if (blockchain === Blockchain.Ethereum) {
      const isValidAddress = ethers.utils.isAddress(address)
      if (!isValidAddress) {
        throw new Error('Invalid Ethereum address')
      }
      const isContract = await this.wallet.isEthContract(address)
      if (isContract) {
        throw new Error('Cannot withdraw to a contract address: ' + address)
      }
      return address.substr(2)
    }

    throw new Error('formatting of withdrawal address not yet supported for ' + blockchain)
  }

  public async createWithdrawal(msg: types.CreateWithdrawalMsg, blockchain: string, options?: types.Options) {
    if (!msg.originator) msg.originator = this.wallet.pubKeyBech32
    msg.to_address = await this.formatWithdrawalAddress(msg.to_address, blockchain)
    return this.wallet.signAndBroadcast([msg], [types.CREATE_WITHDRAWAL_TYPE], options)
  }

  public async mintTokens(msg: types.MintTokenRequest) {
    return fetch(`${this.baseUrl}/mint_tokens`, { method: 'POST', body: JSON.stringify(msg) }).then(res => res.json())
  }
}
