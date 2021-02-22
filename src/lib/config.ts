import { Bech32Type } from "./types"

export interface Network {
  NAME: string,
  REST_URL: string,
  WS_URL: string,
  ETH_PAYER_URL: string,
  FEE_URL: string,
  COSMOS_URL: string,
  NEO_URLS: Array<string>,
  ETH_URL: string,
  ETH_ENV: string,
  BSC_URL: string,
  ETH_WS_URL: string,
  ETH_BALANCE_READER: string,
  ETH_LOCKPROXY: string,
  BSC_LOCKPROXY: string,
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
    REST_URL: `http://${localhost}:${port}`,
    WS_URL: 'ws://localhost:5000/ws',
    ETH_PAYER_URL: `http://${localhost}:7001`,
    FEE_URL: `http://${localhost}:9001`,
    COSMOS_URL: `http://${localhost}:1317`,
    NEO_URLS: ['https://g30trj885e.execute-api.ap-southeast-1.amazonaws.com'],
    ETH_URL: 'https://ropsten.infura.io/v3/e4dd457b33124bbda7e17500e6efbc27',
    ETH_ENV: 'ropsten',
    ETH_WS_URL: 'wss://ropsten.dagger.matic.network',
    BSC_URL: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
    BSC_LOCKPROXY: '0xB7B777722145221B61Ffc6D969643FCE7bE44929',
    ETH_BALANCE_READER: '0xa74c81866c5bfff6684aa8edf35a5de8c3b9f173',
    ETH_LOCKPROXY: '0x7404752ac021940d0c85a25ce2e3aadce9325292',
    FEE_ADDRESS: '989761fb0c0eb0c05605e849cae77d239f98ac7f',
    CHAIN_ID: 'switcheochain',
    BECH32_PREFIX: 'tswth',
  },
  DEVNET: {
    NAME: 'devnet',
    REST_URL: 'https://dev-tradescan.switcheo.org',
    WS_URL: 'wss://dev-ws.dem.exchange/ws',
    ETH_PAYER_URL: 'http://13.251.218.38:7001',
    FEE_URL: 'http://13.251.218.38:9001',
    COSMOS_URL: 'https://dev-tradescan.switcheo.org',
    NEO_URLS: ['https://g30trj885e.execute-api.ap-southeast-1.amazonaws.com'],
    ETH_URL: 'https://ropsten.infura.io/v3/e4dd457b33124bbda7e17500e6efbc27',
    BSC_LOCKPROXY: '0xB7B777722145221B61Ffc6D969643FCE7bE44929',
    BSC_URL: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
    ETH_ENV: 'ropsten',
    ETH_WS_URL: 'wss://ropsten.dagger.matic.network',
    ETH_BALANCE_READER: '0xa74c81866c5bfff6684aa8edf35a5de8c3b9f173',
    ETH_LOCKPROXY: '0x7404752ac021940d0c85a25ce2e3aadce9325292',
    FEE_ADDRESS: '989761fb0c0eb0c05605e849cae77d239f98ac7f',
    CHAIN_ID: 'switcheochain',
    BECH32_PREFIX: 'swth',
  },
  TESTNET: {
    NAME: 'testnet',
    REST_URL: 'https://test-tradescan.switcheo.org',
    WS_URL: 'wss://test-ws.dem.exchange/ws',
    ETH_PAYER_URL: 'http://54.255.42.175:7001',
    FEE_URL: 'http://54.255.42.175:9001',
    COSMOS_URL: 'https://test-tradescan.switcheo.org',
    NEO_URLS: ['https://g30trj885e.execute-api.ap-southeast-1.amazonaws.com'],
    ETH_URL: 'https://ropsten.infura.io/v3/e4dd457b33124bbda7e17500e6efbc27',
    BSC_URL: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
    BSC_LOCKPROXY: '0xB7B777722145221B61Ffc6D969643FCE7bE44929',
    ETH_ENV: 'ropsten',
    ETH_WS_URL: 'wss://ropsten.dagger.matic.network',
    ETH_BALANCE_READER: '0xa74c81866c5bfff6684aa8edf35a5de8c3b9f173',
    ETH_LOCKPROXY: '0x86edf4748efeded37f4932b7de93a575909cc892',
    FEE_ADDRESS: '989761fb0c0eb0c05605e849cae77d239f98ac7f',
    CHAIN_ID: 'switcheochain',
    BECH32_PREFIX: 'tswth',
  },
  MAINNET: {
    NAME: 'mainnet',
    REST_URL: 'https://tradescan.switcheo.org',
    WS_URL: 'wss://ws.dem.exchange/ws',
    ETH_PAYER_URL: 'https://eth-payer.switcheo.org',
    FEE_URL: 'https://fees.switcheo.org',
    COSMOS_URL: 'https://tradescan.switcheo.org',
    NEO_URLS: [
      "https://seed1.switcheo.network:443", // Switcheo seed1
      "https://seed2.switcheo.network:443", // Switcheo seed2
      "https://seed3.switcheo.network:443", // Switcheo seed3
      "https://vlqvfsx107.execute-api.ap-southeast-1.amazonaws.com", // ngd proxy seed1
      "https://qtl81e9fhb.execute-api.ap-southeast-1.amazonaws.com", // ngd proxy seed2
      "https://vonfbyseb2.execute-api.ap-southeast-1.amazonaws.com", // ngd proxy seed3
      "https://cn2t0g46mi.execute-api.ap-southeast-1.amazonaws.com", // ngd proxy seed4
      "https://ojgox44quf.execute-api.ap-southeast-1.amazonaws.com", // ngd proxy seed10
    ],
    ETH_URL: 'https://eth-2.switcheo.network/',
    ETH_ENV: 'ropsten',
    BSC_URL: '',
    BSC_LOCKPROXY: '',
    ETH_WS_URL: 'wss://mainnet.dagger.matic.network',
    ETH_BALANCE_READER: '0xe5e83cdba612672785d835714af26707f98030c3',
    ETH_LOCKPROXY: '0x9a016ce184a22dbf6c17daa59eb7d3140dbd1c54',
    FEE_ADDRESS: '08d8f59e475830d9a1bb97d74285c4d34c6dac08', // swth1prv0t8j8tqcdngdmjlt59pwy6dxxmtqgycy2h7
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

export function getNetwork(net: string): Network {
  if (!net) {
    throw new Error(`network is not defined!`)
  }

  const network = NETWORK[net]
  if (!network) {
    throw new Error('network must be LOCALHOST/DEVNET/TESTNET/MAINNET')
  }
  return network
}
