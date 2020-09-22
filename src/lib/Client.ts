import {EventEmitter} from 'events'
import WebSocket from 'isomorphic-ws'

import MarketClient from './clients/Market/MarketClient'
import TradeClient from './clients/Trade/TradeClient'
import { getNetwork } from '../lib/config'

export enum Network {
  LocalHost = 'LOCALHOST',
  TestNet = 'TESTNET',
  MainNet = 'MAINNET',
  DevNet = 'DEVNET',
}

export enum ClientEvent {
  Connect = 'connect',
  Disconnect = 'disconnect',
}

export default class Client extends EventEmitter {
  public market: MarketClient
  public trade: TradeClient

  private socket: WebSocket
  private channelIdToId: Map<string, string> = new Map()

  constructor(network?: Network) {
    super()

    const [restBaseUrl, wsBaseUrl] = this.getBaseUrls(network)
    this.socket = this.newWebSocket(wsBaseUrl)
    this.market = new MarketClient(restBaseUrl, this.socket)
    this.trade = new TradeClient(restBaseUrl, this.socket)
  }

  private getBaseUrls(network: Network): [string, string] {
    const net = getNetwork(network)
    return [net.REST_URL, net.WS_URL]

  }

  private newWebSocket(baseUrl: string): WebSocket {
    const socket = new WebSocket(baseUrl)

    socket.onopen = () => this.emit(ClientEvent.Connect)
    socket.onclose = () => this.emit(ClientEvent.Disconnect)

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data)
      const {channel, result} = data

      let {id} = data
      if (id) {
        const action = id.split(':')[1]
        if (action === 'sub') {
          const [channelId] = result
          this.channelIdToId.set(channelId, id)
          id += ':ack'
        }
      } else if (channel) {
        id = this.channelIdToId.get(channel)
      }
      else {
        console.error('Unknown event:', data)
        return
      }

      const [clientName] = id.split(':')
      const event = {...data, id}
      const client = this[clientName]
      if (client) {
        client.ws.handleEvent(event)
      } else {
        console.error('Unknown client:', clientName)
      }
    }
  }
}
