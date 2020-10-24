# Tradehub API JS SDK

*Designed for simplicity*

> The code found in this repository is unaudited and incomplete. Switcheo is not responsible for any losses incurred when using this code.

>The Websocket client is still under heavy development.

It is recommended to develop on TestNet.

Head over to [Tradehub Faucet](https://t.me/the_tradehub_bot) get receive free TestNet tokens.


## Features

* Implementation of all General, Market Data, Account, Blockchain endpoints. *WIP*
* Handling of authentication
* Typescript support

## Quick Start

* Create a wallet on https://beta.dem.exchange/.

* Add `tradehub-api-js` to package.json

```
  "dependencies": {
    "tradehub-api-js": "git+ssh://git@github.com/Switcheo/tradehub-api-js"
  }
```

* `yarn install` or `npm install`


* import clients from ``tradehub-api-js``

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

## Examples

>Examples are still under heavy development.

Trading related examples can be found at [/examples/trading.js](https://github.com/Switcheo/tradehub-api-js/blob/master/examples/trading.js)