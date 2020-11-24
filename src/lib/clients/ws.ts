import { EventEmitter } from 'events'
import { getNetwork } from '../config'
import WebSocket from 'isomorphic-ws'

/**
 * @deprecated use WSConnector
 */
export enum MarketEvent {
  SUB_MARKET_STATS = 'market:sub:market_stats',
}

/**
 * @deprecated use WSConnector
 */
export enum ClientEvent {
  Connected = 'connected',
  Disconnected = 'disconnected',
  Message = 'message'
}


/**
 * @deprecated use WSConnector
 */
export class WsClient extends EventEmitter {
  private socket: WebSocket
  protected baseUrl: string
  // private channelIdToId: Map<string, string> = new Map()

  constructor(network: string) {
    super();
    // this.socket = this.newWebSocket(getNetwork(network).WS_URL)
    this.baseUrl = getNetwork(network).WS_URL
  }

  // private newWebSocket(): WebSocket {
  //   this.socket = new WebSocket(this.baseUrl)

  //   this.socket.onopen = () => {
  //     console.log('ws connected')
  //     this.emit(ClientEvent.Connect)
  //   }
  //   this.socket.onclose = () => this.emit(ClientEvent.Disconnect)

    // this.socket.onmessage = (message) => {
    //   console.log('message', message)
    //   const data = JSON.parse(message.data)
    //   const {channel, result} = data

    //   let {id} = data
    //   if (id) {
    //     const action = id.split(':')[1]
    //     if (action === 'sub') {
    //       const [channelId] = result
    //       this.channelIdToId.set(channelId, id)
    //       id += ':ack'
    //     }
    //   } else if (channel) {
    //     id = this.channelIdToId.get(channel)
    //   }
    //   else {
    //     console.error('Unknown event:', data)
    //     return
    //   }

    //   const [clientName] = id.split(':')
    //   const event = {...data, id}
    //   const client = this[clientName]
    //   if (client) {
    //     client.ws.handleEvent(event)
    //   } else {
    //     console.error('Unknown client:', clientName)
    //   }
    // }
  // }
  public connect() {
    this.socket = new WebSocket(this.baseUrl)

    this.socket.onopen = () => {
      this.emit(ClientEvent.Connected)
    }

    this.socket.onclose = () => this.emit(ClientEvent.Disconnected)

    this.socket.onmessage = (message) => {
      const data = JSON.parse(message.data)
      this.emit(ClientEvent.Message, data)

      // const { channel, result } = data

      // let {id} = data
      // if (id) {
      //   const action = id.split(':')[1]
      //   if (action === 'sub') {
      //     const [channelId] = result
      //     this.channelIdToId.set(channelId, id)
      //     id += ':ack'
      //   }
      // } else if (channel) {
      //   id = this.channelIdToId.get(channel)
      // }
      // else {
      //   console.error('Unknown event:', data)
      //   return
      // }

      // const [clientName] = id.split(':')
      // const event = {...data, id}
      // const client = this[clientName]
      // if (client) {
      //   client.ws.handleEvent(event)
      // } else {
      //   console.error('Unknown client:', clientName)
      // }
    }
  }

  public disconnect() {
    this.socket.close()
    this.emit(ClientEvent.Disconnected)
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
      this.send(
        id,
        'subscribe',
        {channels: [channelId]}
      )
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
