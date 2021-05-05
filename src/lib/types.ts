import BigNumber from 'bignumber.js'

// Orders
export const CREATE_ORDER_MSG_TYPE = 'order/MsgCreateOrder'
export const CANCEL_ORDER_MSG_TYPE = 'order/MsgCancelOrder'
export const CANCEL_ALL_MSG_TYPE = 'order/MsgCancelAll'
export const EDIT_ORDER_MSG_TYPE = 'order/MsgEditOrder'
export const CREATE_MARKET_MSG_TYPE = 'market/MsgCreateMarket'
export const UPDATE_MARKET_MSG_TYPE = 'market/MsgUpdateMarket'
export const INITIATE_SETTLEMENT_MSG_TYPE = 'broker/MsgInitiateSettlement'
export const SET_TRADING_FLAG_MSG_TYPE = 'order/MsgSetTradingFlag'

// Positions
export const SET_LEVERAGE_MSG_TYPE = 'leverage/MsgSetLeverage'
export const EDIT_MARGIN_MSG_TYPE = 'position/MsgSetMargin'

// Tokens
export const MINT_TOKEN_MSG_TYPE = 'coin/MsgMintToken'
export const CREATE_TOKEN_MSG_TYPE = 'coin/MsgCreateToken'
export const CREATE_WITHDRAWAL_TYPE = 'coin/MsgWithdraw'
export const SEND_TOKENS_TYPE = 'cosmos-sdk/MsgSend'

// Oracle
export const CREATE_ORACLE_TYPE = 'oracle/MsgCreateOracle'
export const CREATE_VOTE_TYPE = 'oracle/MsgCreateVote'

// Staking
export const CREATE_VALIDATOR_MSG_TYPE = 'cosmos-sdk/MsgCreateValidator'
export const DELEGATE_TOKENS_MSG_TYPE = 'cosmos-sdk/MsgDelegate'
export const BEGIN_UNBONDING_TOKENS_MSG_TYPE = 'cosmos-sdk/MsgUndelegate'
export const BEGIN_REDELEGATING_TOKENS_MSG_TYPE = 'cosmos-sdk/MsgBeginRedelegate'
export const WITHDRAW_DELEGATOR_REWARDS_MSG_TYPE = 'cosmos-sdk/MsgWithdrawDelegationReward'

// Accounts
export const CREATE_SUB_ACCOUNT_MSG_TYPE = 'subaccount/MsgCreateSubAccountV1'
export const ACTIVATE_SUB_ACCOUNT_MSG_TYPE = 'subaccount/MsgActivateSubAccountV1'

// Profile
export const UPDATE_PROFILE_MSG_TYPE = 'profile/MsgUpdateProfile'


// Gov
export const SUBMIT_PROPOSAL_TYPE = 'cosmos-sdk/MsgSubmitProposal'
export const DEPOSIT_PROPOSAL_TYPE = 'cosmos-sdk/MsgDeposit'
export const VOTE_PROPOSAL_TYPE = 'cosmos-sdk/MsgVote'

// AMM
export const ADD_LIQUIDITY_MSG_TYPE = 'liquiditypool/AddLiquidity'
export const REMOVE_LIQUIDITY_MSG_TYPE = 'liquiditypool/RemoveLiquidity'
export const CREATE_POOL_MSG_TYPE = 'liquiditypool/CreatePool'
export const CREATE_POOL_WITH_LIQUIDITY_MSG_TYPE = 'liquiditypool/CreatePoolWithLiquidity'
export const LINK_POOL_MSG_TYPE = 'liquiditypool/LinkPool'
export const UNLINK_POOL_MSG_TYPE = 'liquiditypool/UnlinkPool'
export const SET_REWARDS_WEIGHTS_MSG_TYPE = 'liquiditypool/SetRewardsWeights'
export const SET_REWARD_CURVE_MSG_TYPE = 'liquiditypool/SetRewardCurve'
export const SET_COMMITMENT_CURVE_MSG_TYPE = 'liquiditypool/SetCommitmentCurve'
export const STAKE_POOL_TOKEN_MSG_TYPE = 'liquiditypool/StakePoolToken'
export const UNSTAKE_POOL_TOKEN_MSG_TYPE = 'liquiditypool/UnstakePoolToken'
export const CLAIM_POOL_REWARDS_MSG_TYPE = 'liquiditypool/ClaimPoolRewards'
export const LINK_POOL_PROPOSAL_TYPE = 'liquiditypool/LinkPoolProposal'
export const SET_REWARD_CURVE_PROPOSAL_TYPE = 'liquiditypool/SetRewardCurveProposal'
export const SET_REWARDS_WEIGHT_PROPOSAL_TYPE = 'liquiditypool/SetRewardsWeightsProposal'
export const SET_COMMITMENT_CURVE_PROPOSAL_TYPE = 'liquiditypool/SetCommitmentCurveProposal'
export const CHANGE_SWAP_FEE_PROPOSAL_TYPE = 'liquiditypool/ChangeSwapFeeProposal'
export const CHANGE_NUM_QUOTES_PROPOSAL_TYPE = 'liquiditypool/ChangeNumQuotesProposal'

// CDP
export const CREATE_VAULT_TYPE_MSG_TYPE = 'collateralizeddebtposition/CreateVaultType'
export const ADD_COLLATERAL_MSG_TYPE = 'collateralizeddebtposition/AddCollateral'
export const REMOVE_COLLATERAL_MSG_TYPE = 'collateralizeddebtposition/RemoveCollateral'
export const ADD_DEBT_MSG_TYPE = 'collateralizeddebtposition/AddDebt'
export const REMOVE_DEBT_MSG_TYPE = 'collateralizeddebtposition/RemoveDebt'

// Fee
export const SET_MESSAGE_FEE_TYPE = 'fee/SetMsgFee'
export const SET_MESSAGE_FEE_PROPOSAL_TYPE = 'fee/SetMsgFeeProposal'

export enum Network {
  LocalHost = 'LOCALHOST',
  TestNet = 'TESTNET',
  MainNet = 'MAINNET',
  DevNet = 'DEVNET',
}

export type Bech32Type = 'main' | 'validator' | 'consensus'

export interface SignMessageOptions {
  memo?: string,
  sequence?: string
}


export class Fee {
  public readonly amount: string
  public readonly gas: string

  constructor(amount, gas) {
    this.amount = amount
    this.gas = gas
  }
}

export type CandlestickResolution = 1 | 5 | 30 | 60 | 360 | 1440

export interface CandlesticksParams {
  market: string
  resolution: CandlestickResolution
  from: number
  to: number
}

export interface CandleStickResponse {
  id: number
  market: string
  time: string // string representation of timestamp
  resolution: number
  open: string // string representation of number
  close: string // string representation of number
  high: string // string representation of number
  low: string // string representation of number
  volume: string // string representation of number
  quote_volume: string // string representation of number
}

export interface TransactionOptions {
  fee?: Fee
  mode?: string
  memo?: string
}

export interface PriceLevel {
  price: string
  quantity: string
}

export interface OrderBook {
  asks: Array<PriceLevel>
  bids: Array<PriceLevel>
}

export interface TokenInitInfo {
  address: string
  decimals: number
  symbol: string
  name: string
}

export interface Balance {
  available: string
  denom: string
  order: string
  position: string
}

export interface WalletBalance {
  [key: string]: Balance
}

export interface GetOrdersGetterParams {
  account?: string
  market?: string
  limit?: number
  beforeId?: number
  afterId?: number
  orderStatus?: string
  orderType?: string
}

export interface GetTradesGetterParams {
  address?: string
  market?: string
  limit?: number
  beforeId?: number
  afterId?: number
  orderId?: string
  afterBlock?: number
  beforeBlock?: number
}

export interface GetTransactionsGetterParams {
  address?: string
  msg_type?: string
  height?: string
  start_block?: string
  end_block?: string
  before_id?: string
  after_id?: string
  order_by?: string
  limit?: string
}

export interface TokenOnlyGetterParams {
  token: string
}
export interface PageOnlyGetterParams {
  page: number
}
export interface MarketOnlyGetterParams {
  market: string
}
export interface GetIDOnlyGetterParams {
  id: string
}

export interface MarketAndAddressGetterParams {
  market: string
  address?: string
}

export interface GetPositionGetterParams {
  positionId: string
}

export interface GetPositionsCloseToLiquidationParams {
  market: string
  direction: string
}

export interface GetActiveWalletsParams {
  address?: string
  market?: string
  limit?: number
  beforeId?: number
  afterId?: number
}

export interface GetLeaderboardParams {
  market?: string
  from?: number
  to?: number
  offset?: number
  limit?: number
  order?: string
}

export interface GetBlockHeightParams {
  unix: number
}

export interface GetIndividualPnlParams {
  account: string
  from?: number
  to?: number
}

export interface SetTradingFlagMsg {
  is_enabled: string
  blockchain: string
  originator?: string
}

export interface CreateOrderMsg {
  market: string,
  side: string,
  quantity: string,
  type: string,
  price?: string,
  stop_price?: string,
  time_in_force?: string,
  trigger_type?: string,
  is_reduce_only?: boolean,
  is_post_only?: boolean,
  originator?: string,
}

export type CreateOrder = "create_order"

export interface CancelOrderMsg {
  id: string,
  originator?: string,
}

export interface EditOrderMsg {
  id: string,
  quantity?: string,
  price?: string,
  stop_price?: string,
  originator?: string,
}

export interface CancelAllMsg {
  market: string,
  originator?: string,
}

export interface SendTokensMsg {
  from_address?: string,
  to_address: string,
  amount: Array<{
    denom: string,
    amount: string,
  }>
}

export interface UpdateProfileMsg {
  username: string,
  twitter: string,
  originator?: string,
}

export interface SetLeverageMsg {
  market: string,
  leverage: string,
  originator?: string,
}

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

export interface UpdateMarketMsg {
  name: string,
  display_name: string,
  description: string,
  max_liquidation_order_ticket: string,
  originator?: string,
}

export interface InitiateSettlementMsg {
  market: string,
  originator?: string,
}

export interface EditMarginMsg {
  market: string,
  margin: string,
  originator?: string,
}

export interface CreateTokenMsg {
  name: string,
  symbol: string,
  denom: string,
  decimals: string,
  native_decimals: string,
  blockchain: string,
  chain_id: string,
  asset_id: string,
  is_collateral: boolean,
  lock_proxy_hash: string,
  delegated_supply: string,
  originator?: string,
}

export interface MintParams {
  toAddress: string
  mint: Array<{ denom: string, amount: string }>
}

export interface MintTokenMsg {
  originator?: string
  to_address: string
  amount: string
  denom: string // max 18 decimal places e.g. 1.000000000000000000
}

export interface CreatePoolMsg {
  token_a_denom: string,
  token_b_denom: string,
  token_a_weight: string,
  token_b_weight: string,
  swap_fee: string,
  num_quotes: string,
  originator?: string,
}

export const FEE_TYPES = {
  'order/MsgCreateOrder': 'create_order',
  'liquiditypool/ClaimPoolRewards': 'claim_pool_rewards',
  'oracle/MsgCreateOracle': 'create_oracle_vote',
  'liquiditypool/CreatePool': 'create_pool',
  'liquiditypool/StakePoolToken': 'stake_pool_token',
  'liquiditypool/UnstakePoolToken': 'unstake_pool_token',
  Default: 'default_fee'
}

export interface CreatePoolWithLiquidityMsg extends CreatePoolMsg {
  amount_a: string
  amount_b: string
}

export interface LinkPoolMsg {
  pool_id: string,
  market: string,
  originator?: string,
}

export interface UnlinkPoolMsg {
  pool_id: string,
  originator?: string,
}
export interface RewardsWeight {
  pool_id: string,
  weight: string,
}
export interface SetRewardsWeightsMsg {
  weights: RewardsWeight[],
  originator?: string,
}

export interface SetRewardCurveMsg {
  start_time: number,
  initial_reward_bps: number
  reduction_multiplier_bps: number
  reduction_interval_seconds: number
  reductions: number
  final_reward_bps: number
  originator?: string,
}
export interface SetCommitmentCurveMsg {
  max_duration: number,
  max_reward_multiplier: number
  originator?: string,
}

export interface StakePoolTokenMsg {
  denom: string,
  amount: string,
  duration: string, // seconds
  originator?: string,
}
export interface UnstakePoolTokenMsg {
  denom: string,
  amount: string,
  originator?: string,
}
export interface ClaimPoolRewardsMsg {
  pool_id: string,
  originator?: string,
}

export interface AddLiquidityMsg {
  pool_id: string
  amount_a: string
  amount_b: string
  min_shares: string
  originator?: string
}

export interface RemoveLiquidityMsg {
  pool_id: string,
  shares: string,
  originator?: string,
}

export interface CreateVaultTypeMsg {
  collateral_denom: string
  debt_denom: string
  collateralization_ratio: string
  originator?: string
}

export interface AddCollateralMsg {
  vault_type_id: string
  amount: string
  originator?: string
}

export interface RemoveCollateralMsg {
  vault_type_id: string
  amount: string
  originator?: string
}

export interface AddDebtMsg {
  vault_type_id: string
  amount: string
  originator?: string
}

export interface RemoveDebtMsg {
  vault_type_id: string
  amount: string
  originator?: string
}

export type ProposalValue = ProposalParameterChangeValue | ProposalTokenValue |
  ProposalMarketValue | ProposalSettlementPriceValue | ProposalOracleValue | ProposalOracleResultValue |
  ProposalLinkPoolValue | ProposalUnlinkPoolValue | ProposalCreateTokenValue | ProposalSetPoolRewardWeightsValue |
  ProposalSetCommitmentCurveValue | ProposalCreateMarketValue

export interface ProposalParameterChangeValue {
  title: string,
  description: string,
  changes: ReadonlyArray<{
    subspace: string,
    key: string,
    value: string,
  }>,
}

export interface ProposalTokenValue {
  title: string,
  description: string,
  token: {
    name: string,
    symbol: string,
    denom: string,
    decimals: string,
    native_decimals: string,
    blockchain: string,
    chain_id: string,
    asset_id: string,
    is_collateral: boolean,
    lock_proxy_hash: string,
    delegated_supply: string,
    originator: string,
  }
}

export interface ProposalMarketValue {
  title: string,
  description: string,
  market: {
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
    originator: string,
  }
}

export interface ProposalSettlementPriceValue {
  title: string,
  description: string,
  market: string,
  settlement_price: string,
}

export interface ProposalOracleValue {
  title: string,
  description: string,
  oracle: {
    id: string,
    description: string,
    min_turnout_percentage: string,
    max_result_age: string,
    security_type: string,
    result_strategy: string,
    resolution: string,
    spec: string,
    originator: string,
  },
}

export interface ProposalOracleResultValue {
  title: string,
  description: string,
  oracle_result: {
    oracle_id: string,
    timestamp: string,
    data: string,
  },
}

export interface ProposalLinkPoolValue {
  title: string
  description: string
  msg: {
    pool_id: string
    market: string
    originator: string
  }
}

export interface ProposalUnlinkPoolValue {
  title: string
  description: string
  msg: {
    pool_id: string
    originator: string
  }
}

export interface ProposalCreateTokenValue {
  title: string
  description: string
  token: {
    name: string
    symbol: string
    denom: string
    decimals: string
    native_decimals: string
    blockchain: string
    chain_id: string
    asset_id: string
    is_collateral: boolean
    lock_proxy_hash: string
    delegated_supply: string
    originator: string
  }
}
export interface PoolWeightObject {
  pool_id: string
  weight: string
}

interface PoolWeightObjectList extends Array<PoolWeightObject> { }
export interface ProposalSetPoolRewardWeightsValue {
  title: string
  description: string
  msg: {
    weights: PoolWeightObjectList
    originator: string
  }
}

export interface ProposalSetCommitmentCurveValue {
    title: string,
    description: string,
    msg: {
      max_duration: string,
      max_reward_multiplier: number,
      originator: string,
    }
}

export interface ProposalCreateMarketValue {
  title: string,
  description: string,
  market: {
    name: string,
    display_name: string,
    market_type: 'spot' | 'futures',
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
    originator: string,
  }
}

export interface SubmitProposalMsg<ProposalValue> {
  content: {
    type: string,
    value: ProposalValue,
  },
  initial_deposit?: ReadonlyArray<{
    denom: string,
    amount: string,
  }>,
  proposer?: string,
}

export interface DepositProposalMsg {
  proposal_id: string,
  depositor?: string,
  amount: ReadonlyArray<{
    denom: string,
    amount: string,
  }>,
}

export interface VoteProposalMsg {
  proposal_id: string,
  voter?: string,
  option: string,
}

export interface CreateOracleMsg {
  id: string,
  description: string,
  min_turnout_percentage: string,
  max_result_age: string,
  security_type: string,
  result_strategy: string,
  resolution: string,
  spec: string,
  originator?: string,
}

export interface CreateVoteMsg {
  oracle_id: string,
  timestamp: string,
  data: string,
  originator?: string,
}

export interface DelegateTokensMsg {
  delegator_address: string,
  validator_address: string,
  amount: {
    amount: string,
    denom: string,
  },
}

export interface BeginUnbondingTokensMsg {
  delegator_address: string,
  validator_address: string,
  amount: {
    amount: string,
    denom: string,
  },
}

export interface BeginRedelegatingTokensMsg {
  delegator_address: string,
  validator_src_address: string,
  validator_dst_address: string,
  amount: {
    amount: string,
    denom: string,
  },
}

export interface WithdrawDelegatorRewardsMsg {
  delegator_address: string,
  validator_address: string,
}

export interface WithdrawAllDelegatorRewardsParams {
  delegatorAddress: string,
  validatorAddresses: string[],
}

export interface CreateValidatorMsg {
  description: {
    moniker: string,
    identity: string,
    website: string,
    details: string,
  },
  commission: {
    rate: string,
    max_rate: string,
    max_rate_change: string,
  },
  min_self_delegation: string,
  delegator_address: string,
  validator_address: string,
  pubkey: string,
  value: {
    amount: string,
    denom: string,
  },
}

export interface CreateSubAccountMsg {
  sub_address: string,
  originator?: string,
}

export interface ActivateSubAccountMsg {
  expected_main_account: string,
  originator?: string,
}

export interface AddressOnlyGetterParams {
  address: string
}

export interface UsernameGetterParams {
  username: string
}

export interface PoolIDAndAddressGetter {
  address: string
  poolID: string
}

export interface PoolIDAndBlockHeightGetter {
  blockheight: string
  poolID: string
}

export interface blockHeightGetter {
  blockheight: string
}

export interface CreateWithdrawalMsg {
  to_address: string,
  denom: string,
  amount: string,
  fee_amount: string,
  fee_address: string,
  originator?: string,
}

export interface MintTokenRequest {
  address: string,
  amount: string,
  denom: string,
}

export interface MintTokenDirectMsg {
  originator: string,
  to_address: string,
  amount: string,
  denom: string,
}

export interface SetMsgFeeMsg {
  msg_type: string,
  fee: string,
  originator?: string,
}

export interface Options extends SignMessageOptions, TransactionOptions { }

export interface LiquidityPoolResponse {
  pool_id: string
  name: string
  denom: string
  denom_a: string
  amount_a: string
  weight_a: string
  denom_b: string
  amount_b: string
  weight_b: string
  swap_fee: string
  creator_address: string
  pool_address: string
  block_height: number
  shares_amount: string
  total_commitment: string
  market: string
  rewards_weight: string
  volume: string
}

export type GetLiquidityPoolsResponse = LiquidityPoolResponse[]

export interface RewardsDistributed {
  amount: string
  denom: string
}

export type RewardsDistributedResponse = RewardsDistributed[]

export interface GetAMMRewardPercentageResponse {
  height: string
  result: string
}

export interface GetStakedPoolTokenInfoResult {
  denom: string
  amount: string
  start_time: string
  end_time: string
  duration: string
  is_locked: boolean
  boost_factor: string
  commitment_power: string
}
export interface GetStakedPoolTokenInfoResponse {
  height: string
  result: GetStakedPoolTokenInfoResult
}

export interface GetInflationStartTimeResponse {
  height: string
  block_time: string
}

export interface AccruedRewardsResponse {
  [key: string]: BigNumber
}

export interface GetLeaderboardResponse {
  count: string
  data: LeaderboardDataResponse[]
  limit: string
  market: string
  offset: string
  from_block: string
  to_block: string
  from_time: string
  to_time: string
}

export interface LeaderboardDataResponse {
  address: string
  denom: string
  realized_pnl: string
  username: string
}

export interface GetBlockHeightResponse {
  height: string // string representation of number
  block_time: string // string representation of timestamp
}

export interface IndivPnlData {
  realized_pnl: string
}

export interface GetIndivPnlResponse {
  data: IndivPnlData[]
  from_block: string // string representation of number
  from_time: string // string representation of unix timestamp
  to_block: string // string representation of number
  to_time: string // string representation of unix timestamp
}
