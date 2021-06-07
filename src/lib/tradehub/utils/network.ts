export enum Network {
  LocalHost = "localhost",
  TestNet = "testnet",
  MainNet = "mainnet",
  DevNet = "devnet",
}

export interface EthNetworkConfig {
  RpcURL: string
  WsURL: string
  PayerURL: string
  LockProxyAddr: string
  BalanceReader: string
  ByteCodeHash: string
}

export interface NeoNetworkConfig {
  RpcURL: string
  WrapperScriptHash: string
}

export interface ZilNetworkConfig {
  RpcURL: string
  ChainId: number
  LockProxyAddr: string
}

export interface NetworkConfig {
  Network: Network
  Bech32Prefix: string

  RestURL: string
  WsURL: string

  FeeURL: string
  FeeAddress: string

  ChainId: string

  Eth: EthNetworkConfig
  Bsc: EthNetworkConfig

  Neo: NeoNetworkConfig
  Zil: ZilNetworkConfig
}

export interface NetworkConfigProvider {
  getConfig(): NetworkConfig
}

const localhost = process.env.REST_HOST ?? '127.0.0.1'
const restPort = process.env.REST_PORT ?? '5001'

export const NetworkConfigs: {
  [key in Network]: NetworkConfig
} = {
  [Network.LocalHost]: {
    Network: Network.LocalHost,
    Bech32Prefix: 'tswth',

    RestURL: `http://${localhost}:${restPort}`,
    WsURL: `ws://${localhost}:5000/ws`,

    FeeURL: `http://${localhost}:9001`,
    FeeAddress: '989761fb0c0eb0c05605e849cae77d239f98ac7f',

    ChainId: 'switcheochain',

    Eth: {
      RpcURL: 'https://ropsten.infura.io/v3/e4dd457b33124bbda7e17500e6efbc27',
      WsURL: 'wss://ropsten.dagger.matic.network',
      PayerURL: `http://${localhost}:7001`,
      LockProxyAddr: '',
      BalanceReader: '',
      ByteCodeHash: '',
    },

    Bsc: {
      RpcURL: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
      WsURL: '',
      PayerURL: `http://${localhost}:8001`,
      LockProxyAddr: '',
      BalanceReader: '',
      ByteCodeHash: '',
    },

    Neo: {
      RpcURL: 'https://g30trj885e.execute-api.ap-southeast-1.amazonaws.com',
      WrapperScriptHash: 'f46719e2d16bf50cddcef9d4bbfece901f73cbb6',
    },

    Zil: {
      RpcURL: '',
      LockProxyAddr: '',
      ChainId: 1,
    }
  },

  [Network.DevNet]: {
    Network: Network.DevNet,
    Bech32Prefix: 'swth',

    RestURL: 'https://dev-tradescan.switcheo.org',
    WsURL: 'wss://dev-ws.dem.exchange/ws',

    FeeURL: `http://13.251.218.38:9001`,
    FeeAddress: '989761fb0c0eb0c05605e849cae77d239f98ac7f',

    ChainId: 'switcheochain',

    Eth: {
      RpcURL: 'https://ropsten.infura.io/v3/e4dd457b33124bbda7e17500e6efbc27',
      WsURL: 'wss://ropsten.dagger.matic.network',
      PayerURL: `http://13.251.218.38:7001`,
      LockProxyAddr: '0x7404752ac021940d0c85a25ce2e3aadce9325292',
      BalanceReader: '0xa74c81866c5bfff6684aa8edf35a5de8c3b9f173',
      ByteCodeHash: '0xc77e5709a69e94d310a6dfb700801758c4caed0385b25bdf82bbdf954e4dd0c3',
    },

    Bsc: {
      RpcURL: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
      WsURL: '',
      PayerURL: `http://13.251.218.38:8001`,
      LockProxyAddr: '0x7c2b13d656d222cb79670e301dd826dc5b8dc20c',
      BalanceReader: '0x25c22f65cb820e787a13951f295d0b86db7b07b5',
      ByteCodeHash: '0x1b147c1cef546fcbcc1284df778073d65b90f80d5b649a69d5f8a01e186c0ec1',
    },

    Neo: {
      RpcURL: 'https://g30trj885e.execute-api.ap-southeast-1.amazonaws.com',
      WrapperScriptHash: 'f46719e2d16bf50cddcef9d4bbfece901f73cbb6',
    },

    Zil: {
      RpcURL: 'https://poly-api.zilliqa.com',
      LockProxyAddr: '0xa5484b227f35f5e192e444146a3d9e09f4cdad80',
      ChainId: 888,
    }
  },

  [Network.TestNet]: {
    Network: Network.TestNet,
    Bech32Prefix: 'tswth',

    RestURL: 'https://test-tradescan.switcheo.org',
    WsURL: 'wss://test-ws.dem.exchange/ws',

    FeeURL: `http://54.255.42.175:9001`,
    FeeAddress: '989761fb0c0eb0c05605e849cae77d239f98ac7f',

    ChainId: 'switcheochain',

    Eth: {
      RpcURL: 'https://ropsten.infura.io/v3/e4dd457b33124bbda7e17500e6efbc27',
      WsURL: 'wss://ropsten.dagger.matic.network',
      PayerURL: `http://54.255.42.175:7001`,
      LockProxyAddr: '0x86edf4748efeded37f4932b7de93a575909cc892',
      BalanceReader: '0xa74c81866c5bfff6684aa8edf35a5de8c3b9f173',
      ByteCodeHash: '0xc77e5709a69e94d310a6dfb700801758c4caed0385b25bdf82bbdf954e4dd0c3',
    },

    Bsc: {
      RpcURL: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
      WsURL: '',
      PayerURL: `http://54.255.42.175:8001`,
      LockProxyAddr: '0x7c2b13d656d222cb79670e301dd826dc5b8dc20c',
      BalanceReader: '0x25c22f65cb820e787a13951f295d0b86db7b07b5',
      ByteCodeHash: '0x1b147c1cef546fcbcc1284df778073d65b90f80d5b649a69d5f8a01e186c0ec1',
    },

    Neo: {
      RpcURL: 'https://g30trj885e.execute-api.ap-southeast-1.amazonaws.com',
      WrapperScriptHash: 'f46719e2d16bf50cddcef9d4bbfece901f73cbb6',
    },

    Zil: {
      RpcURL: '',
      LockProxyAddr: '',
      ChainId: 333,
    }
  },

  [Network.MainNet]: {
    Network: Network.MainNet,
    Bech32Prefix: 'swth',

    RestURL: `https://tradescan.switcheo.org`,
    WsURL: `wss://ws.dem.exchange/ws`,

    FeeURL: `https://fees.switcheo.org`,
    FeeAddress: '08d8f59e475830d9a1bb97d74285c4d34c6dac08', // swth1prv0t8j8tqcdngdmjlt59pwy6dxxmtqgycy2h7

    ChainId: 'switcheo-tradehub-1',

    Eth: {
      RpcURL: 'https://eth-2.switcheo.network/',
      WsURL: 'wss://mainnet.dagger.matic.network',
      PayerURL: `https://eth-payer.switcheo.org`,
      LockProxyAddr: '0x9a016ce184a22dbf6c17daa59eb7d3140dbd1c54',
      BalanceReader: '0xe5e83cdba612672785d835714af26707f98030c3',
      ByteCodeHash: '0xc77e5709a69e94d310a6dfb700801758c4caed0385b25bdf82bbdf954e4dd0c3',
    },

    Bsc: {
      RpcURL: 'https://bsc-dataseed2.binance.org/',
      WsURL: '',
      PayerURL: `https://bsc-payer.switcheo.org`,
      LockProxyAddr: '0xb5d4f343412dc8efb6ff599d790074d0f1e8d430',
      BalanceReader: '0x2b18c5e1edaa7e27d40fec8d0b7d96c5eefa35df',
      ByteCodeHash: '0x1b147c1cef546fcbcc1284df778073d65b90f80d5b649a69d5f8a01e186c0ec1',
    },

    Neo: {
      RpcURL: 'https://seed1.switcheo.network:443',
      WrapperScriptHash: 'f46719e2d16bf50cddcef9d4bbfece901f73cbb6',
    },

    Zil: {
      RpcURL: '',
      LockProxyAddr: '',
      ChainId: 1,
    }
  },
}
