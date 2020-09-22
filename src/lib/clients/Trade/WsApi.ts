import BaseWsApi from '../BaseWsApi'

export enum TradeEvent {
    GET_RECENT_TRADES = 'trade:get:get_recent_trades',
    SUB_RECENT_TRADES = 'trade:sub:recent_trades',
}

export default class WsApi extends BaseWsApi {

  public subscribeRecentTrades(market: string) {
        const channelId: string = `recent_trades.${market}`
        const id: string = `trade:sub:${channelId}`
        super.subscribe(id, channelId)
    }

    public unsubscribeRecentTrades(market: string) {
      const channelId: string = `recent_trades.${market}`
      const id: string = `trade:unsub:${channelId}`
      super.unsubscribe(id, channelId)
    }

    public getRecentTrades(market: string) {
      super.send(TradeEvent.GET_RECENT_TRADES, 'get_recent_trades', {market})
    }
}
