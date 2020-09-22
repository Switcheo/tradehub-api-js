/*
  WsWrapper is a wrapper that helps to manage the socket connection with the server.
  Manages IDs for messages

  Methods:
    connect
    disconnect
    request
    subscribe
    unsubscribe
*/

/* WS Get Request params */
import {Network} from "../Client";
import { getNetwork } from '../config'

export interface WsGetRecentTradesParams {
  market: string,
}

export interface WsGetCandlesticksParams {
  market: string,
  resolution: string,
  from?: string,
  to?: string
}
export interface WsGetOrderHistoryParams {
  market: string,
  address: string,
}

export interface WsGetOpenOrdersParams {
  market: string,
  address: string,
}

export interface WsGetAccountTradesParams {
  market: string
  address: string
  page?: number
}

export interface WsGetMarketStatsParams {
  market: string
}

export interface WsGetLeveragesParams {
  market: string,
  address: string,
}

export interface WsGetPositionsParams {
  market: string,
  address: string,
}

/* WS subscribe params */
export interface WsSubscribeCandlesticksParams {
  channel: string,
  market: string,
  resolution: string,
  subscribeUID: string,
}
export interface WsSubscribeRecentTradesParams {
  channel: string,
  market: string,
}
export interface WsSubscribeOrdersParams {
  channel: string,
  market?: string,
  address: string,
}

export interface WsSubscribeBooksParams {
  channel: string,
  market: string,
}

export interface WsSubscribeWalletBalanceParams {
  channel: string,
  address: string,
}

export interface WsSubscribeAccountTradesParams {
  channel: string,
  market?: string,
  address: string,
}

export interface WsSubscribeMarketStatsParams {
  channel: string
  market?: string
}

export interface WsSubscribeLeveragesParams {
  channel: string
  market?: string
  address: string
}

export interface WsSubscribePositionsParams {
  channel: string
  market?: string
  address: string
}

/* WS unsubscribe params */
export interface WsUnsubscribeCandlesticksParams {
  channel: string,
  market: string,
  resolution: string,
}

export type WsSubscribeParams =
  WsSubscribeCandlesticksParams |
  WsSubscribeRecentTradesParams |
  WsSubscribeOrdersParams |
  WsSubscribeWalletBalanceParams |
  WsSubscribeBooksParams |
  WsSubscribeAccountTradesParams |
  WsSubscribeMarketStatsParams |
  WsSubscribeLeveragesParams |
  WsUnsubscribeCandlesticksParams

export class WsWrapper {
  serverWsUrl: string
  socket: any
  msgNum: number
  isConnected: boolean = false
  onMsgCallback: any

  public getBaseUrls = function (network) {
    const net = getNetwork(network)
    return net.WS_URL
  };

  constructor(net: Network, onMsgCallback: any) {

    this.serverWsUrl = this.getBaseUrls(net)
    this.onMsgCallback = onMsgCallback
  }

  public connect() {
    this.socket = new WebSocket(this.serverWsUrl)

    // Config socket
    this.socket.onopen = () => {
      this.isConnected = true
      console.log('socket is connected')
      this.onMsgCallback("connected")
    }

    this.socket.onmessage = (msg: any) => {
      this.onMsgCallback(msg)
    }

    this.socket.onclose = () => {
      this.isConnected = false
      console.log('socket off')
    }
  }

  public disconnect() {
    console.log("closing socket...")
    this.socket.close()
  }

  public checkIsConnected(): boolean {
    return this.isConnected
  }

  // WS Get requests

  public wsGetOrderHistory(msgId: string, params: WsGetOrderHistoryParams) {
    try {
      const msg = JSON.stringify({
        id: msgId,
        method: 'get_order_history',
        params: { market: params.market, address: params.address }
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public wsGetRecentTrades(msgId: string, p: WsGetRecentTradesParams) {
    try {
      const msg = JSON.stringify({
        id: msgId,
        method: 'get_recent_trades',
        params: { market: p.market }
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public wsGetCandlesticks(msgId: string, p: WsGetCandlesticksParams) {
    try {
      const msg = JSON.stringify({
        id: msgId,
        method: 'get_candlesticks',
        params: {
          market: p.market, resolution: p.resolution,
          from: p.from, to: p.to
        }
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public wsGetOpenOrders(msgId: string, params: WsGetOpenOrdersParams) {
    try {
      const msg = JSON.stringify({
        id: msgId,
        method: 'get_open_orders',
        params: { market: params.market, address: params.address }
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public wsGetAccountTrades(msgId: string, params: WsGetAccountTradesParams) {
    try {
      const msg = JSON.stringify({
        id: msgId,
        method: 'get_account_trades',
        params,
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public wsGetMarketStats(msgId: string, params: WsGetMarketStatsParams) {
    try {
      const msg = JSON.stringify({
        id: msgId,
        method: 'get_market_stats',
        params,
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public wsGetLeverages(msgId: string, params: WsGetLeveragesParams) {
    try {
      const msg = JSON.stringify({
        id: msgId,
        method: 'get_leverages',
        params,
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public wsGetOpenPositions(msgId: string, params: WsGetLeveragesParams) {
    try {
      const msg = JSON.stringify({
        id: msgId,
        method: 'get_open_positions',
        params,
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public wsGetClosedPositions(msgId: string, params: WsGetLeveragesParams) {
    try {
      const msg = JSON.stringify({
        id: msgId,
        method: 'get_closed_positions',
        params,
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  // WS Subscriptions

  public subscribe(msgId: string, params: WsSubscribeParams[]) { // List of params
    try {
      let channelIds: string[] = params.map((p) => this.generateChannelId(p))
      console.log("Subscribing to " + msgId)
      const msg = JSON.stringify({
        id: msgId,
        method: 'subscribe',
        params: { "channels": [...channelIds] }
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public unsubscribe(msgId: string, params: WsSubscribeParams[]) {
    try {
      let channelIds: string[] = params.map((p) => this.generateChannelId(p))
      console.log("Unsubscribing to " + channelIds)
      const msg = JSON.stringify({
        id: msgId,
        method: 'unsubscribe',
        params: { "channels": [...channelIds] }
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public parseChannelId = (rawChannelId: string): any => {
    const [channel, market, resolution, address] = rawChannelId.split(".")
    switch (channel) {
      case 'candlesticks':
        return {
          channel,
          market,
          resolution,
        }
      case 'books':
        return {
          channel,
          market,
        }
      case 'recent_trades':
        return {
          channel,
          market,
        }
      case 'orders':
        return {
          channel,
          address,
        }
      case 'orders_by_market':
        return {
          channel,
          market,
          address,
        }
      case 'balances':
        return {
          channel,
          address,
        }
      case 'account_trades':
        return {
          channel,
          address,
        }
      case 'account_trades_by_market':
        return {
          channel,
          market,
          address,
        }
      case 'market_stats':
        return {
          channel,
        }
      case 'market_stats_by_market':
        return {
          channel,
          market,
        }
      case 'leverages':
        return {
          channel,
          address,
        }
      case 'leverages_by_market':
        return {
          channel,
          market,
          address,
        }
      case 'positions':
        return {
          channel,
          address,
        }
      case 'positions_by_market':
        return {
          channel,
          market,
          address,
        }
      default:
        throw new Error("Error parsing channelId")
    }
  }

  public generateChannelId(p: WsSubscribeParams): string {
    switch (p.channel) {
      case 'candlesticks': {
        let { channel, market, resolution } = <WsSubscribeCandlesticksParams>p
        return [channel, market, resolution].join('.')
      }
      case 'books': {
        let { channel, market } = <WsSubscribeBooksParams>p
        return [channel, market].join('.')
      }
      case 'recent_trades': {
        let { channel, market } = <WsSubscribeRecentTradesParams>p
        return [channel, market].join('.')
      }
      case 'orders': {
        let { channel, address } = <WsSubscribeOrdersParams>p
        return [channel, address].join('.')
      }
      case 'orders_by_market': {
        let { channel, market, address } = <WsSubscribeOrdersParams>p
        return [channel, market, address].join('.')
      }
      case 'balances': {
        let { channel, address } = <WsSubscribeWalletBalanceParams>p
        return [channel, address].join('.')
      }
      case 'account_trades': {
        let { channel, address } = <WsSubscribeAccountTradesParams>p
        return [channel, address].join('.')
      }
      case 'account_trades_by_market': {
        let { channel, market, address } = <WsSubscribeAccountTradesParams>p
        return [channel, market, address].join('.')
      }
      case 'market_stats': {
        let { channel } = <WsSubscribeMarketStatsParams>p
        return [channel].join('.')
      }
      case 'market_stats_by_market': {
        let { channel, market } = <WsSubscribeMarketStatsParams>p
        return [channel, market].join('.')
      }
      case 'leverages': {
        let { channel, address } = <WsSubscribeWalletBalanceParams>p
        return [channel, address].join('.')
      }
      case 'leverages_by_market': {
        let { channel, market, address } = <WsSubscribeOrdersParams>p
        return [channel, market, address].join('.')
      }
      case 'positions': {
        let { channel, address } = <WsSubscribePositionsParams>p
        return [channel, address].join('.')
      }
      case 'positions_by_market': {
        let { channel, market, address } = <WsSubscribePositionsParams>p
        return [channel, market, address].join('.')
      }
      default:
        throw new Error("Invalid subscription")
    }
  }
}
