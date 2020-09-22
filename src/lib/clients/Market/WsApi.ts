import BaseWsApi from '../BaseWsApi'

export enum MarketEvent {
  SUB_MARKET_STATS = 'market:sub:market_stats',
}

export default class WsApi extends BaseWsApi{
  public subscribeMarketStats() {
    const channelId: string = 'market_stats'
    const id: string = `market:sub:${channelId}`
    super.subscribe(id, channelId)
  }

  public unsubscribeMarketStats() {
    const channelId: string = 'market_stats'
    const id: string = `market:unsub:${channelId}`
    super.unsubscribe(id, channelId)
  }
}
