const { ClientEvent, MarketEvent, WsClient } = require('../build/main')

const ws = new WsClient()

ws.on(ClientEvent.Message, (msg) => {
  console.log('received msg:', msg)
})

ws.on(ClientEvent.Connected, () => {
  console.log('ws conntected')
  ws.subscribeMarketStats()
})

ws.on(ClientEvent.Disconnected, () => {
    console.log('socket off')
})

ws.connect()
