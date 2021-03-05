const TradehubEndpoints = {
  // generic apis
  'markets/list': '/get_markets',
  'account/detail': '/get_account',
  'account/username_check': '/username_check',
  'account/get_profile': '/get_profile',

  // validators
  'validators/delegations': '/staking/validators/:validator/delegations',
} as const

export default TradehubEndpoints;
