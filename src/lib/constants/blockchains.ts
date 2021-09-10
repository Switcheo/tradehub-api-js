import { Blockchain as _Blockchain } from "../tradehub/utils/blockchain"
export import Blockchain = _Blockchain;

export const ChainNames = {
  1: 'MainNet',
  3: 'Ropsten',
  56: 'BSC MainNet',
  97: 'BSC TestNet',
  110: 'ZIL DevNet',
  111: 'ZIL TestNet',
} as const

export const blockchainForChainId = (chainId?: number) => {
  switch (chainId) {
    case 1:
    case 3:
      return Blockchain.Ethereum
    case 56:
    case 97:
      return Blockchain.BinanceSmartChain
    case 110:
    case 111:
      return Blockchain.Zilliqa
  }
  return undefined
}
