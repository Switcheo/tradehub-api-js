export interface Network {
  NAME: string,
  REST_URL: string,
  WS_URL: string,
  RELAYER_URL: string,
  COSMOS_URL: string,
  SWTH_CHAIN_ID: number,
  NEO_URL: string,
  NEO_LOCKPROXY: string,
  ETH_ENV: string,
  ETH_WS_URL: string,
  ETH_BALANCE_READER: string,
  ETH_WALLET_FACTORY: string,
  TARGET_PROXY_HASH: string,
  FEE_ADDRESS: string,
  CHAIN_ID: string,
  BECH32_PREFIX: string,
}

const localhost = process.env.REST_HOST || '127.0.0.1'
const port = process.env.REST_PORT || '5001'

interface NetworkInterface {
  [NET: string]: Network
}

export const NETWORK: NetworkInterface = {
  LOCALHOST: {
    NAME: 'localhost',
    SWTH_CHAIN_ID: 1000,
    REST_URL: `http://${localhost}:${port}`,
    WS_URL: 'ws://localhost:5000/ws',
    RELAYER_URL: `http://${localhost}:7001`,
    COSMOS_URL: `http://${localhost}:1317`,
    NEO_URL: 'http://47.89.240.111:12332',
    NEO_LOCKPROXY: '5faf564a13601fc39b7e1a3bbc862c450538fa89',
    ETH_ENV: 'ropsten',
    ETH_WS_URL: 'wss://ropsten.dagger.matic.network',
    ETH_BALANCE_READER: '0xb3c33ac95eda80dfa6853cc9bee5294a6bf98f80',
    ETH_WALLET_FACTORY: '0x86edf4748efeded37f4932b7de93a575909cc892',
    TARGET_PROXY_HASH: 'db8afcccebc026c6cae1d541b25f80a83b065c8a',
    FEE_ADDRESS: '989761fb0c0eb0c05605e849cae77d239f98ac7f',
    CHAIN_ID: 'switcheochain',
    BECH32_PREFIX: 'tswth',
  },
  DEVNET: {
    NAME: 'devnet',
    SWTH_CHAIN_ID: 180,
    REST_URL: 'https://dev-tradescan.switcheo.org',
    WS_URL: 'wss://dev-ws.dem.exchange/ws',
    RELAYER_URL: `http://13.251.218.38:7001`,
    COSMOS_URL: 'https://dev-tradescan.switcheo.org',
    NEO_URL: 'http://47.89.240.111:12332',
    NEO_LOCKPROXY: '5faf564a13601fc39b7e1a3bbc862c450538fa89',
    ETH_ENV: 'ropsten',
    ETH_WS_URL: 'wss://ropsten.dagger.matic.network',
    ETH_BALANCE_READER: '0xb3c33ac95eda80dfa6853cc9bee5294a6bf98f80',
    ETH_WALLET_FACTORY: '0x86edf4748efeded37f4932b7de93a575909cc892',
    TARGET_PROXY_HASH: 'db8afcccebc026c6cae1d541b25f80a83b065c8a',
    FEE_ADDRESS: '989761fb0c0eb0c05605e849cae77d239f98ac7f',
    CHAIN_ID: 'switcheochain',
    BECH32_PREFIX: 'swth',
  },
  TESTNET: {
    NAME: 'testnet',
    SWTH_CHAIN_ID: 1000,
    REST_URL: 'https://test-tradescan.switcheo.org',
    WS_URL: 'wss://test-ws.dem.exchange/ws',
    RELAYER_URL: `http://54.255.42.175:7001`,
    COSMOS_URL: 'https://test-tradescan.switcheo.org',
    NEO_URL: 'http://47.89.240.111:12332',
    NEO_LOCKPROXY: '5faf564a13601fc39b7e1a3bbc862c450538fa89',
    ETH_ENV: 'ropsten',
    ETH_WS_URL: 'wss://ropsten.dagger.matic.network',
    ETH_BALANCE_READER: '0xb3c33ac95eda80dfa6853cc9bee5294a6bf98f80',
    ETH_WALLET_FACTORY: '0x86edf4748efeded37f4932b7de93a575909cc892',
    TARGET_PROXY_HASH: 'db8afcccebc026c6cae1d541b25f80a83b065c8a',
    FEE_ADDRESS: '989761fb0c0eb0c05605e849cae77d239f98ac7f',
    CHAIN_ID: 'switcheochain',
    BECH32_PREFIX: 'tswth',
  },
  MAINNET: {
    NAME: 'mainnet',
    SWTH_CHAIN_ID: 6,
    REST_URL: 'https://tradescan.switcheo.org',
    WS_URL: 'wss://ws.dem.exchange/ws',
    RELAYER_URL: 'https://tradescan.switcheo.org',
    COSMOS_URL: 'https://tradescan.switcheo.org',
    NEO_URL: '',
    NEO_LOCKPROXY: 'cd19745dbf1305f206978ddcfdcb7fca6ef6d017',
    ETH_ENV: 'ropsten',
    ETH_WS_URL: 'wss://ropsten.dagger.matic.network',
    ETH_BALANCE_READER: '0xb3c33ac95eda80dfa6853cc9bee5294a6bf98f80',
    ETH_WALLET_FACTORY: '0x86edf4748efeded37f4932b7de93a575909cc892',
    TARGET_PROXY_HASH: 'db8afcccebc026c6cae1d541b25f80a83b065c8a',
    FEE_ADDRESS: '08d8f59e475830d9a1bb97d74285c4d34c6dac08',
    CHAIN_ID: 'switcheo-tradehub-1',
    BECH32_PREFIX: 'swth',
  },
}

export const CONFIG = {
  DEFAULT_GAS: '100000000000', // TOOD: make this configurable 1000 SWTH
}

const BECH32_PREFIXES = {
  validator: 'val',
  operator: 'oper',
  consensus: 'cons',
  public: 'pub',
}

type Bech32Type = 'main' | 'validator' | 'consensus'

export function getBech32Prefix(net: Network, type: Bech32Type = 'main') {
  const mainPrefix = net.BECH32_PREFIX
  switch (type) {
    case 'main':
      // e.g. swth
      return mainPrefix
    case 'validator':
      // e.g. swthvaloper
      return mainPrefix + BECH32_PREFIXES.validator + BECH32_PREFIXES.operator
    case 'consensus':
      // e.g. swthvalconspub
      return mainPrefix + BECH32_PREFIXES.validator + BECH32_PREFIXES.consensus + BECH32_PREFIXES.public
    default:
      return mainPrefix
  }
}

export function getNetwork(net): Network {
  const network = NETWORK[net]
  if (!network) {
    throw new Error('network must be LOCALHOST/DEVNET/TESTNET')
  }
  return network
}
