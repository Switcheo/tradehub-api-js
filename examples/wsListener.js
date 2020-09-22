const { default: Client, ClientEvent, Network, MarketEvent } = require('../.')

const client = new Client(Network.TestNet)

const marketWsApi = client.market.ws
marketWsApi.on(MarketEvent.SUB_MARKET_STATS, (msg) => {
    console.log('received msg:', msg)
})

client.on(ClientEvent.Connect, () => {
    marketWsApi.subscribeMarketStats()
})

client.on(ClientEvent.Disconnect, () => {
    console.log('socket off')
})
