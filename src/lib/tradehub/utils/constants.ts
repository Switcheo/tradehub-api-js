import BigNumber from "bignumber.js";
import { SimpleMap } from "./types";

export const BN_ONE = new BigNumber(1);
export const BN_ZERO = new BigNumber(0);

export const SWTH_DECIMALS = 8;
export const ONE_SWTH = BN_ONE.shiftedBy(SWTH_DECIMALS);

// 0.0000001 SWTH
// 10 SWTH sats
export const DEFAULT_GAS_PRICE = new BigNumber(10);
export const DEFAULT_GAS = new BigNumber(10000000);

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
    INITIATE_SETTLEMENT: 'broker/MsgInitiateSettlement', // not in chain
    INITIATE_LIQUIDATION: 'broker/MsgInitiateLiquidation'
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
    SYNC_TOKEN: 'coin/MsgSyncToken',
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
    CHANGE_SWAP_FEE: 'liquiditypool/ChangeSwapFee',
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

export const TxFeeTypeDefaultKey = "default_fee";
export const TxFeeTypeMap = {
  "claim_pool_rewards": TxTypes.LiquidityPool.CLAIM_POOL_REWARDS,
  "create_oracle_vote": TxTypes.Oracle.CREATE_VOTE_TYPE,
  "create_order": TxTypes.Order.CREATE,
  "create_pool": TxTypes.LiquidityPool.CREATE_POOL,
  "create_pool_with_liquidity": TxTypes.LiquidityPool.CREATE_POOL_WITH_LIQUIDITY,
  "stake_pool_token": TxTypes.LiquidityPool.STAKE_POOL_TOKEN,
  "unstake_pool_token": TxTypes.LiquidityPool.UNSTAKE_POOL_TOKEN,
  "withdraw": TxTypes.Coin.CREATE_WITHDRAWAL_TYPE,
}

export const CommonAssetName: SimpleMap = {
  swth: 'swth',
  'swth-n': 'swth',
  'swth-b': 'swth',
  'swth-e': 'swth',
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
  yam1: 'yam',
  yam2: 'yam',
  'trb1-3c2c697a0ad67fed978d3dd7ec61c464': 'trb',
  'tru-e2de3f751ecb78216c447144c8c1f4bf': 'tru',
  'usdt1-176391161fae2a4819870b05a720e642': 'usdt',
  'grt-43b071c61ac0332f7c85cff55b60f9d7': 'grt',
  'inch-1cf6e72a3b6db4bc509c5fa97df8865b': '1inch',
  'okb.e.1': 'okb',
  'aave.e.1': 'aave',
  'mkr.e.1': 'mkr',
  'cro.e.1': 'cro',
  'dai.e.1': 'dai',
  'comp.e.1': 'comp',
  'tel.e.1': 'tel',
  'snx.e.1': 'snx',
  'sushi.e.1': 'sushi',
  'chz.e.1': 'chz',
  'hot.e.1': 'hot',
  'enj.e.1': 'enj',
  'nexo.e.1': 'nexo',
  'bat.e.1': 'bat',
  'yfi.e.1': 'yfi',
  'grt.e.1': 'grt',
  'omg.e.1': 'omg',
  'bnt.e.1': 'bnt',
  'zrx.e.1': 'zrx',
  'one.e.1': 'one',
  'chsb.e.1': 'chsb',
  'crv.e.1': 'crv',
  'nxm.e.1': 'nxm',
  'snt.e.1': 'snt',
  'bal.e.1': 'bal',
  'rlc.e.1': 'rlc',
  'lrc.e.1': 'lrc',
  'ocean.e.1': 'ocean',
  'btmx.e.1': 'btmx',
  'band.e.1': 'band',
  'knc.e.1': 'knc',
  'inj.e.1': 'inj',
  'gno.e.1': 'gno',
  'fun.e.1': 'fun',
  'sxp.e.1': 'sxp',
  'iotx.e.1': 'iotx',
  'nkn.e.1': 'nkn',
  'stmx.e.1': 'stmx',
  'agi.e.1': 'agi',
  'oxt.e.1': 'oxt',
  'nmr.e.1': 'nmr',
  'sand.e.1': 'sand',
  'poly.e.1': 'poly',
  'ant.e.1': 'ant',
  'ogn.e.1': 'ogn',
  'storj.e.1': 'storj',
  'zil.z.1': 'zil',
  'eth.z.1': 'eth',
  'usdt.z.1': 'usdt',
  'wbtc.z.1': 'wbtc',
  'zeth.z.1': 'eth',
  'zusdt.z.3': 'usdt',
  'zwbtc.z.1': 'wbtc',
  'zwap.z.1': 'zwap',
  'xsgd.z.1': 'xsgd',
  'gzil.z.1': 'gzil',
  'port.e.1': 'port',
  'port.z.1': 'port',
  'xcad.e.1': 'xcad',
  'xcad.z.1': 'xcad',
  asa1: 'asa',
  asa2: 'asa',
  dbc1: 'dbc',
  dbc2: 'dbc',
  'lkt.7ef7febf': 'lkt',
  'lkt.bep20.c5a4937a': 'lkt',

  // devnet tokens
  'zil1': 'zil',
  'zil.e': 'zil',
  'zil9': 'zil',
  'zil9.e': 'zil',
  'zil5.e': 'zil',
  'zil5.z': 'zil',
  'zil6.z': 'zil',
  'zwap1.e': 'zwap',
  'zwap5.e': 'zwap',
  'zwap5.z': 'zwap',
  'zwap1': 'zwap',

  'dai1': 'dai',
  'dai.z': 'dai',
  'dai5.z': 'dai',

  'eth5.z': 'dai',

  'usdt.e': 'usdt',
  'usdt1.z': 'usdt',
  'usdt2.z': 'usdt',
};

export const CoinGeckoTokenNames: SimpleMap = {
  swth: 'switcheo',
  btc: 'bitcoin',
  dai: 'dai',
  uni: 'uniswap',
  link: 'chainlink',
  nneo: 'neo',
  eth: 'ethereum',
  flm: 'flamingo-finance',
  usdc: 'usd-coin',
  usdt: 'tether',
  cel: 'celsius-degree-token',
  nex: 'neon-exchange',
  wbtc: 'wrapped-bitcoin',
  bnb: 'binancecoin',
  busd: 'binance-usd',
  btcb: 'binance-bitcoin',
  tru: 'truebit-protocol',
  zil: 'zilliqa',
  zwap: 'zilswap',
  trb: 'tellor',
  grt: 'the-graph',
  inch: '1inch',
  storj: 'storj',
  ogn: 'origin-protocol',
  ant: 'aragon',
  poly: 'polymath-network',
  sand: 'the-sandbox',
  nmr: 'numeraire',
  oxt: 'orchid-protocol',
  agi: 'singularitynet',
  stmx: 'storm',
  nkn: 'nkn',
  iotx: 'iotex',
  sxp: 'swipe',
  fun: 'funfair',
  gno: 'gnosis',
  inj: 'injective-protocol',
  knc: 'kyber-network',
  band: 'band-protocol',
  btmx: 'asd',
  ocean: 'ocean-protocol',
  lrc: 'loopring',
  rlc: 'iexec-rlc',
  bal: 'balancer',
  snt: 'status',
  nxm: 'nxm',
  crv: 'curve-dao-token',
  chsb: 'swissborg',
  one: 'harmony',
  zrx: '0x',
  bnt: 'bancor',
  omg: 'omisego',
  yfi: 'yearn-finance',
  bat: 'basic-attention-token',
  nexo: 'nexo',
  enj: 'enjincoin',
  hot: 'holotoken',
  chz: 'chiliz',
  sushi: 'sushi',
  snx: 'havven',
  tel: 'telcoin',
  comp: 'compound-governance-token',
  cro: 'crypto-com-chain',
  mkr: 'maker',
  aave: 'aave',
  okb: 'okb',
  helmet: 'helmet-insure',
  belt: 'belt',
  busdt: 'tether',
  cgas: 'gas',
  dbc: 'deepbrain-chain',
  yam: 'yam-2',
  asa: 'asura',
  eps: 'ellipsis',
  ada: 'binance-peg-cardano',
  wbnb: 'wbnb',
  doge: 'binance-peg-dogecoin',
  xrp: 'binance-peg-xrp',
  dot: 'binance-peg-polkadot',
  bch: 'binance-peg-bitcoin-cash',
  ltc: 'binance-peg-litecoin',
  etc: 'ethereum-classic',
  eos: 'binance-peg-eos',
  trx: 'tron-bsc',
  xtz: 'tezos',
  cake: 'pancakeswap-token',
  atom: 'cosmos',
  safemoon: 'safemoon',
  ust: 'wrapped-ust-bsc',
  zec: 'zcash',
  pax: 'paxos-standard',
  near: 'near',
  ont: 'ontology',
  wrx: 'wazirx',
  bake: 'bakerytoken',
  ankr: 'ankr',
  bcha: 'bitcoin-cash-abc-2',
  bcfx: 'conflux-token',
  mir: 'mirror-protocol',
  reef: 'reef-finance',
  xvs: 'venus',
  btcst: 'btc-standard-hashrate-token',
  tlm: 'alien-worlds-bsc',
  prom: 'prometeus',
  alpha: 'alpha-finance',
  dodo: 'dodo',
  math: 'math',
  lkt: 'locklet',
  gzil: 'governance-zil',
  xsgd: 'xsgd',
  xcad: 'xcad-network',
  port: 'packageportal',
};

export const FuturesDenomOverride: SimpleMap = {
  WBTC: 'BTC',
  USDC: 'USD',
}
