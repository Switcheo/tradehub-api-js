const TradehubEndpoints = {
  // generic apis
  'markets/list': '/get_markets',
  'account/detail': '/get_account',

  // validators
  'validators/delegations': '/staking/validators/:validator/delegations',
} as const

export default TradehubEndpoints;
