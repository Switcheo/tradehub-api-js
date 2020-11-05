import { SignMessageOptions } from './clients/wallet'
import { TransactionOptions } from './containers/Transaction'

// Orders
export const CREATE_ORDER_MSG_TYPE = 'order/MsgCreateOrder'
export const CANCEL_ORDER_MSG_TYPE = 'order/MsgCancelOrder'
export const CANCEL_ALL_MSG_TYPE = 'order/MsgCancelAll'
export const EDIT_ORDER_MSG_TYPE = 'order/MsgEditOrder'
export const ADD_MARKET_MSG_TYPE = 'market/MsgCreateMarket'
export const INITIATE_SETTLEMENT_MSG_TYPE = 'broker/MsgInitiateSettlement'

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
export const UPDATE_PROFILE_MSG_TYPE = 'profile/UpdateProfile'

export const ADD_LIQUIDITY_MSG_TYPE = 'amm/AddLiquidity'
export const REMOVE_LIQUIDITY_MSG_TYPE = 'amm/RemoveLiquidity'
export const CREATE_POOL_MSG_TYPE = 'amm/CreatePool'
export const CREATE_POOL_WITH_LIQUIDITY_MSG_TYPE = 'amm/CreatePoolWithLiquidity'
export const LINK_POOL_MSG_TYPE = 'amm/LinkPool'
export const UNLINK_POOL_MSG_TYPE = 'amm/UnlinkPool'
export const SET_REWARDS_WEIGHTS_MSG_TYPE = 'amm/setRewardsWeights'

// Gov
export const SUBMIT_PROPOSAL_TYPE = 'cosmos-sdk/MsgSubmitProposal'
export const DEPOSIT_PROPOSAL_TYPE = 'cosmos-sdk/MsgDeposit'
export const VOTE_PROPOSAL_TYPE = 'cosmos-sdk/MsgVote'

// AMM
export const LINK_POOL_PROPOSAL_TYPE = 'amm/LinkPoolProposal'

export enum Network {
  LocalHost = 'LOCALHOST',
  TestNet = 'TESTNET',
  MainNet = 'MAINNET',
  DevNet = 'DEVNET',
}

export type Bech32Type = 'main' | 'validator' | 'consensus'

export interface PriceLevel {
  price: string
  quantity: string
}

export interface OrderBook {
  asks: Array<PriceLevel>
  bids: Array<PriceLevel>
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
  address?: string
  market?: string
  limit?: number
  beforeId?: number
  afterId?: number
  status?: string
  orderType?: string
}

export interface GetTradesGetterParams {
  address?: string
  market?: string
  limit?: number
  beforeId?: number
  afterId?: number
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
  Username: string,
  Twitter: string,
  Originator?: string,
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
  token_a_denom?: string,
  token_b_denom?: string,
  token_a_weight?: string,
  token_b_weight?: string,
  swap_fee?: string,
  originator?: string,
}

export interface CreatePoolWithLiquidityMsg extends CreatePoolMsg {
  amount_a?: string
  amount_b?: string
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

export interface AddLiquidityMsg {
  pool_id: string
  amount_a?: string
  amount_b?: string
  min_shares?: string
  originator?: string
}

export interface RemoveLiquidityMsg {
  pool_id: string,
  shares: string,
  originator?: string,
}

export type ProposalValue = ProposalParameterChangeValue | ProposalTokenValue |
  ProposalMarketValue | ProposalSettlementPriceValue | ProposalOracleValue | ProposalOracleResultValue

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
  market: string
  rewards_weight: string
  volume: string
}

export type GetLiquidityPoolsResponse = LiquidityPoolResponse[]

export interface GetAMMRewardPercentageResponse {
  height: string
  result: string
}