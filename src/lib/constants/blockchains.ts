export enum Blockchain {
  Neo = 'neo',
  Ethereum = 'eth',
  BinanceSmartChain = 'bsc',
}

export const ChainNames = {
  1: 'MainNet',
  3: 'Ropsten',
  56: 'BSC MainNet',
  97: 'BSC TestNet',
} as const
