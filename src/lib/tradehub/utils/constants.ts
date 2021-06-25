import BigNumber from "bignumber.js";
import { SimpleMap } from "./types";

export const BN_ONE = new BigNumber(1);
export const BN_ZERO = new BigNumber(0);

export const SWTH_DECIMALS = 8;
export const ONE_SWTH = BN_ONE.shiftedBy(SWTH_DECIMALS);


// 0.0001 SWTH
// 1000 SWTH sats
export const DEFAULT_GAS_PRICE = new BigNumber(1).shiftedBy(2)
export const DEFAULT_GAS = new BigNumber(1000000);

export const TxTypes = {
  Order: {
    CREATE: 'order/MsgCreateOrder',
    CANCEL: 'order/MsgCancelOrder',
    CANCEL_ALL: 'order/MsgCancelAll',
    EDIT: 'order/MsgEditOrder',

    SET_TRADING_FLAG: 'order/MsgSetTradingFlag',
  },

  Market: {
    CREATE: 'market/MsgCreateMarket',
    UPDATE: 'market/MsgUpdateMarket',
  },

  Broker: {
    INITIATE_SETTLEMENT: 'broker/MsgInitiateSettlement',
  },

  Leverage: {
    SET_LEVERAGE: 'leverage/MsgSetLeverage',
  },

  Position: {
    EDIT_MARGIN: 'position/MsgSetMargin',
  },

  Coin: {
    MINT_TOKEN: 'coin/MsgMintToken',
    CREATE_TOKEN: 'coin/MsgCreateToken',
    CREATE_WITHDRAWAL_TYPE: 'coin/MsgWithdraw',
    SEND_TOKENS_TYPE: 'cosmos-sdk/MsgSend',
  },

  Oracle: {
    CREATE_ORACLE_TYPE: 'oracle/MsgCreateOracle',
    CREATE_VOTE_TYPE: 'oracle/MsgCreateVote',
  },

  Staking: {
    CREATE_VALIDATOR: 'cosmos-sdk/MsgCreateValidator',
    DELEGATE_TOKENS: 'cosmos-sdk/MsgDelegate',
    BEGIN_UNBONDING_TOKENS: 'cosmos-sdk/MsgUndelegate',
    BEGIN_REDELEGATING_TOKENS: 'cosmos-sdk/MsgBeginRedelegate',
    WITHDRAW_DELEGATOR_REWARDS: 'cosmos-sdk/MsgWithdrawDelegationReward',
  },

  Account: {
    CREATE_SUB_ACCOUNT: 'subaccount/MsgCreateSubAccountV1',
    ACTIVATE_SUB_ACCOUNT: 'subaccount/MsgActivateSubAccountV1',

    UPDATE_PROFILE: 'profile/MsgUpdateProfile',
  },

  Governance: {
    SUBMIT_PROPOSAL: 'cosmos-sdk/MsgSubmitProposal',
    DEPOSIT_PROPOSAL: 'cosmos-sdk/MsgDeposit',
    VOTE_PROPOSAL: 'cosmos-sdk/MsgVote',
  },

  LiquidityPool: {
    ADD_LIQUIDITY: 'liquiditypool/AddLiquidity',
    REMOVE_LIQUIDITY: 'liquiditypool/RemoveLiquidity',
    CREATE_POOL: 'liquiditypool/CreatePool',
    CREATE_POOL_WITH_LIQUIDITY: 'liquiditypool/CreatePoolWithLiquidity',
    LINK_POOL: 'liquiditypool/LinkPool',
    UNLINK_POOL: 'liquiditypool/UnlinkPool',
    SET_REWARDS_WEIGHTS: 'liquiditypool/SetRewardsWeights',
    SET_REWARD_CURVE: 'liquiditypool/SetRewardCurve',
    SET_COMMITMENT_CURVE: 'liquiditypool/SetCommitmentCurve',
    STAKE_POOL_TOKEN: 'liquiditypool/StakePoolToken',
    UNSTAKE_POOL_TOKEN: 'liquiditypool/UnstakePoolToken',
    CLAIM_POOL_REWARDS: 'liquiditypool/ClaimPoolRewards',

    LINK_POOL_PROPOSAL: 'liquiditypool/LinkPoolProposal',
    SET_REWARD_CURVE_PROPOSAL: 'liquiditypool/SetRewardCurveProposal',
    SET_REWARDS_WEIGHT_PROPOSAL: 'liquiditypool/SetRewardsWeightsProposal',
    SET_COMMITMENT_CURVE_PROPOSAL: 'liquiditypool/SetCommitmentCurveProposal',
    CHANGE_SWAP_FEE_PROPOSAL: 'liquiditypool/ChangeSwapFeeProposal',
    CHANGE_NUM_QUOTES_PROPOSAL: 'liquiditypool/ChangeNumQuotesProposal',
  },

  CDP: {
    CREATE_VAULT_TYPE: 'collateralizeddebtposition/CreateVaultType',
    ADD_COLLATERAL: 'collateralizeddebtposition/AddCollateral',
    REMOVE_COLLATERAL: 'collateralizeddebtposition/RemoveCollateral',
    ADD_DEBT: 'collateralizeddebtposition/AddDebt',
    REMOVE_DEBT: 'collateralizeddebtposition/RemoveDebt',
  },

  Fee: {
    SET_MESSAGE_FEE_TYPE: 'fee/SetMsgFee',
    SET_MESSAGE_FEE_PROPOSAL_TYPE: 'fee/SetMsgFeeProposal',
  },
} as const

export const CommonAssetName: SimpleMap = {
  swth: 'swth',
  'swth-n': 'swth',
  'swth-b': 'swth',
  dai: 'dai',
  flm1: 'flm',
  eth1: 'eth',
  btc1: 'btc',
  usdc1: 'usdc',
  wbtc1: 'wbtc',
  cel1: 'cel',
  nex1: 'nex',
  nneo2: 'nneo',
  bnb1: 'bnb',
  bnb2: 'bnb',
  busd1: 'busd',
  btcb1: 'btcb',
  busdt1: 'busdt',
  bbelt1: 'bbelt',
  elink1: 'link',
  elink2: 'link',
  euni1: 'uni',
  euni2: 'uni',
  ncgas1: 'cgas',
};

export const CoinGeckoTokenNames: SimpleMap = {
  swth: 'switcheo',
  btc: 'bitcoin',
  dai: 'dai',
  uni: 'uniswap',
  link: 'link',
  nneo: 'neo',
  eth: 'ethereum',
  flm: 'flamingo-finance',
  usdc: 'usd-coin',
  cel: 'celsius-degree-token',
  nex: 'neon-exchange',
  wbtc: 'wrapped-bitcoin',
  bnb: 'binancecoin',
  busd: 'binance-usd',
  btcb: 'binance-bitcoin',
  tru: 'truebit-protocol',
};
