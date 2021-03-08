const TradehubEndpoints = {
  // generic apis
  'markets/list': '/get_markets',
  'account/detail': '/get_account',
  'account/username_check': '/username_check',
  'account/get_profile': '/get_profile',
  'history/get_position': '/get_position',
  'history/get_positions': '/get_positions',
  'account/get_leverage': '/get_leverage',
  'history/get_order': '/get_order',
  'history/get_orders': '/get_orders',
  'history/get_account_trades': '/get_trades_by_account',
  'tradehub/get_nodes': '/monitor',

  // validators
  'validators/delegations': '/staking/validators/:validator/delegations',
} as const

export default TradehubEndpoints;
