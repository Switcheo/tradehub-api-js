import { EventEmitter } from 'events'

export default class BaseWsApi extends EventEmitter {
  protected socket: WebSocket

  constructor(socket: WebSocket) {
    super();
    this.socket = socket;
  }

  public handleEvent(event) {
    this.emit(event.id, event)
  }

  public send(id: string, method: string, params: {}) {
    try {
      this.socket.send(JSON.stringify({
        id,
        method,
        params,
      }))
    } catch (e) {
      console.error(e.message)
    }
  }

  public subscribe(id: string, channelId: string) {
    try {
      this.socket.send(JSON.stringify({
        id,
        method: 'subscribe',
        params: {'channels': [channelId]}
      }))
    } catch (e) {
      console.error(e.message)
    }
  }

  public unsubscribe(id: string, channelId: string) {
    try {
      this.socket.send(JSON.stringify({
        id,
        method: 'unsubscribe',
        params: {'channels': [channelId]}
      }))
    } catch (e) {
      console.error(e.message)
    }
  }

  public subscribeMarketStats() {
    const channelId: string = 'market_stats'
    const id: string = `market:sub:${channelId}`
    this.subscribe(id, channelId)
  }

  public unsubscribeMarketStats() {
    const channelId: string = 'market_stats'
    const id: string = `market:unsub:${channelId}`
    this.unsubscribe(id, channelId)
  }
}
