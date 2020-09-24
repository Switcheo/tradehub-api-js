<<<<<<< HEAD
const { default: Client, ClientEvent, Network, MarketEvent } = require('../.')

const client = new Client(Network.TestNet)

console.log(client)
=======
const { BaseRestApi, BaseWsApi } = require('../.')

// console.log('BaseRestApi', BaseRestApi)
// const c = new BaseRestApi()
const w = new BaseWsApi()
console.log('w', w)
w.subscribeMarketStats()
>>>>>>> 8e98f8228dca83e99cad6f4a3f322a8b44b2e08a
