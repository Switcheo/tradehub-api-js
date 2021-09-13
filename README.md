# Tradehub API JS SDK

*Designed for simplicity*

It is recommended to develop on TestNet.


## Features

* Implementation of all General, Market Data, Account, Blockchain endpoints. *WIP*
* Handling of authentication
* Typescript support

## Quick Start

* Create a wallet on https://app.dem.exchange/.

* Add `tradehub-api-js` to package.json

```
  "dependencies": {
    "tradehub-api-js": "git+ssh://git@github.com/Switcheo/tradehub-api-js"
  }
```

* `yarn install` or `npm install`


* import clients from `tradehub-api-js`

```
  const { WalletClient, RestClient, WsClient } = require('tradehub-api-js')

  const network = 'TESTNET'

  async function run() {
    const wallet = await WalletClient.connectMnemonic(process.env.MNEMONICS, network)
    const rest = new RestClient({ wallet, network })
    const ws = new WsClient(network)
  }

  run()
```
