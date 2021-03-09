const TradehubEndpoints = {
  // generic api
  'tradehub/get_nodes': '/monitor',

  // account api
  'account/detail': '/get_account',
  'account/username_check': '/username_check',
  'account/get_profile': '/get_profile',
  'account/get_balance': '/get_balance',
  'account/get_leverage': '/get_leverage',

  // market api
  'markets/list': '/get_markets',
  'markets/get_market': '/get_market',
  'markets/get_markets': '/get_markets',
  'markets/get_prices': '/get_prices',
  'markets/get_orderbook': '/get_orderbook',

  // history api
  'history/get_position': '/get_position',
  'history/get_positions': '/get_positions',
  'history/get_order': '/get_order',
  'history/get_orders': '/get_orders',
  'history/get_account_trades': '/get_trades_by_account',
  
  // validators
  'validators/delegations': '/staking/validators/:validator/delegations',
} as const

export default TradehubEndpoints;
