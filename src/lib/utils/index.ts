export * from './address'
export * from './encoder'
export * from './wallet'
export * from './logger'

import BigNumber from 'bignumber.js'

export function bn(n) {
  return new BigNumber(n)
}

export function formatAmount(amount, decimals) {
  const multiplier = bn(10).exponentiatedBy(decimals)
  return bn(amount).multipliedBy(multiplier)
}
