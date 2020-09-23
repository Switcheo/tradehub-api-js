const { default: Client, ClientEvent, Network, MarketEvent } = require('../.')

const client = new Client()
console.log('client', client)

const marketWsApi = client.ws
marketWsApi.on(MarketEvent.SUB_MARKET_STATS, (msg) => {
    console.log('received msg:', msg)
})

client.on(ClientEvent.Connect, () => {
    marketWsApi.subscribeMarketStats()
})

client.on(ClientEvent.Disconnect, () => {
    console.log('socket off')
})
