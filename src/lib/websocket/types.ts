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
