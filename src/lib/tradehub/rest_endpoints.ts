const TradehubEndpoints = {
  // generic apis
  'markets/list': '/get_markets',
  'account/detail': '/get_account',
  'account/username_check': '/username_check',
  'account/get_profile': '/get_profile',
  'account/get_position': '/get_position',
  'account/get_positions': '/get_positions',
  'account/get_leverage': '/get_leverage',
  'orders/get_order': '/get_order',

  // validators
  'validators/delegations': '/staking/validators/:validator/delegations',
} as const

export default TradehubEndpoints;
