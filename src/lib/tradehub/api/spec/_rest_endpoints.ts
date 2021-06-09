export const TradehubEndpoints = {
  // generic api
  'tradehub/txs': '/txs',
  'tradehub/get_nodes': '/monitor',
  'tradehub/get_tx': '/get_transaction',
  'tradehub/get_txs': '/get_transactions',
  'tradehub/get_txns_fees': '/get_txns_fees',
  'tradehub/get_tx_log': '/get_tx_log',
  'tradehub/get_tx_types': '/get_transaction_types',
  'tradehub/get_blocks': '/get_blocks',
  'tradehub/get_cosmos_block': '/blocks/:height',
  'tradehub/get_block_height_from_unix': 'get_blockheight_from_unix',
  'tradehub/get_average_block_time': '/get_block_time',
  'tradehub/get_token': '/get_token',
  'tradehub/get_tokens': '/get_tokens',
  'tradehub/get_rich_list': '/get_rich_list',
  'tradehub/get_vault_types': '/get_vault_types',
  'tradehub/get_vaults': '/get_vaults',

  // account api
  'account/detail': '/get_account',
  'account/username_check': '/username_check',
  'account/get_profile': '/get_profile',
  'account/get_balance': '/get_balance',
  'account/get_total_balances': '/get_total_balances',
  'account/get_leverage': '/get_leverage',
  'account/get_active_wallets': '/get_active_wallets',
  'account/get_realized_pnl': '/get_account_realized_pnl',
  'account/get_transfers': '/get_external_transfers',

  // market api
  'markets/list': '/get_markets',
  'markets/get_market': '/get_market',
  'markets/get_markets': '/get_markets',
  'markets/get_prices': '/get_prices',
  'markets/get_orderbook': '/get_orderbook',
  'markets/get_market_stats': '/get_market_stats',
  'markets/get_insurence_fund_balance': '/get_insurance_balance',
  'markets/get_liquidity_pools': '/get_liquidity_pools',
  'markets/get_leaderboard': '/get_leaderboard',
  'markets/get_positions_sorted_by_pnl': '/get_positions_sorted_by_pnl',
  'markets/get_positions_sorted_by_risk': '/get_positions_sorted_by_risk',
  'markets/get_positions_sorted_by_size': '/get_positions_sorted_by_size',
  'markets/get_amm_reward_percentage': '/get_amm_reward_percentage',
  'markets/candlesticks': '/candlesticks',

  // history api
  'history/get_position': '/get_position',
  'history/get_positions': '/get_positions',
  'history/get_order': '/get_order',
  'history/get_orders': '/get_orders',
  'history/get_account_trades': '/get_trades_by_account',
  'history/get_trades': '/get_trades',
  'history/get_liquidation_trades': '/get_liquidations',
  
  // staking api
  'staking/get_staking_pool': '/staking/pool',
  'staking/delegator_delegations': '/staking/delegators/:address/delegations',
  'staking/delegator_unbonding_delegations': '/staking/delegators/:address/unbonding_delegations',
  'staking/redelegations': '/staking/redelegations',
  'staking/delegation_rewards': '/distribution/delegators/:address/rewards',
  'staking/get_staked_pool_token_info': '/get_staked_pool_token',
  'staking/get_inflation_start_time': '/get_inflation_start_time',

  // validators
  'validators/delegations': '/staking/validators/:validator/delegations',
  'validators/get_all': '/get_all_validators',
  'validators/get_staking_validators': '/staking/validators',
} as const
