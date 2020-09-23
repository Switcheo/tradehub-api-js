const { default: Client, ClientEvent, Network, MarketEvent } = require('../.')

const client = new Client(Network.TestNet)

console.log(client)