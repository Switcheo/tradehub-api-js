import { generateChannelId, parseChannelId } from './channel'
import * as WSConnectorTypes from './types'

import { logger } from '../utils'

// delay between pings.
const DEFAULT_INTERVAL_HEARTBEAT = 3000

// 2x DEFAULT_INTERVAL_HEARTBEAT to allow for missing
// one heartbeat without triggering disconnect.
const DEFAULT_TIMEOUT_HEARTBEAT = 6100

// see WSConnector.timeoutConnect
const DEFAULT_TIMEOUT_CONNECT = 2000

export const { WSChannel } = WSConnectorTypes
export { WSConnectorTypes }

export interface WSStatusChangeListener {
  (connected: boolean): void
}

export interface WSConnectorOptions {
  endpoint: string
  onStatusChange?: WSStatusChangeListener
  debugMode?: boolean

  timeoutConnect?: number

  intervalHeartbeat?: number
  timeoutHeartbeat?: number
  disableHeartbeat?: boolean
}

export interface WSResult<T = unknown> {
  requestId?: string
  channel?: string
  outOfSequence: boolean
  timestamp: Date
  data: T
}

interface PromiseHandler {
  requestId?: string
  resolve: (result?: WSResult<any>) => void
  reject: (reason?: any) => void
}

interface WSError {
  code: string
  message: string
}

interface WSMessage<T> {
  requestId: string
  channel?: string
  sequenceNumber: number
  error?: WSError
  result?: WSResult<T>
}

interface WSSubscriber {
  (result: WSResult<unknown>): void
}

interface PromiseHandlerCache {
  [index: string]: PromiseHandler
}

interface MessageSubscribers {
  [index: string]: WSSubscriber
}

/**
 *
 */
export class WSConnector {
  // websocket endpoint
  endpoint: string

  // prints logs if set to true
  debugMode: boolean

  // delay in milliseconds before a ping message is sent to
  // the socket server
  // disables ping messages if value is ≤ 0
  intervalHeartbeat: number

  // timeout in milliseconds before connection is deemed broken.
  // resets every intervalHeartbeat
  // disables timeout if value is ≤ 0
  timeoutHeartbeat: number

  // timeout in milliseconds to try to connect to websocket
  // endpoint.
  timeoutConnect: number

  // flag for disabling websocket heartbeats entirely
  // meaning websocket will not disconnect on client
  // when connection is broken
  disableHeartbeat: boolean

  // websocket instance
  websocket: WebSocket | null = null

  // used to tracking websocket messages, increment by 1 every request
  requestIdCounter: number = 0

  // true if connection initiated, even if connection is not established
  // will cause reconnect attempts if true.
  shouldConnect: boolean = false

  // true only if connection is established and ready to use
  connected: boolean = false

  // called whenever WSConnector.connected changes
  statusChangeListener?: WSStatusChangeListener

  // promise abstraction handler for WSConnector.connect
  connectPromiseHandler: PromiseHandler | null = null

  // promise abstraction handlers store for WSConnector.request
  requestHandlers: PromiseHandlerCache = {}

  // channel subscription handlers
  channelHandlers: MessageSubscribers = {}

  // used for track ws message sequence, for some cases a out of sequence
  // message is invalid and request have to be resent.
  sequenceNumberCache: {
    [index: string]: number
  } = {}

  // interval ID for tracking active setInterval
  heartbeatInterval?: number

  // timeout ID for tracking active setTimeout
  heartbeatTimeout?: number

  // timeout ID for catching websocket instantiation error
  // which cannot be caught with a try-catch block
  initFailureTimeout?: number

  public static generateChannelId = generateChannelId

  public static parseChannelId = parseChannelId

  /**
   *
   * @param options
   */
  constructor(
    options: WSConnectorOptions,
  ) {
    const {
      endpoint,
      debugMode = false,
      timeoutConnect = DEFAULT_TIMEOUT_CONNECT,
      intervalHeartbeat = DEFAULT_INTERVAL_HEARTBEAT,
      timeoutHeartbeat = DEFAULT_TIMEOUT_HEARTBEAT,
      disableHeartbeat = false,
      onStatusChange,
    } = options

    this.endpoint = endpoint
    this.debugMode = debugMode
    this.timeoutConnect = timeoutConnect
    this.intervalHeartbeat = intervalHeartbeat
    this.timeoutHeartbeat = timeoutHeartbeat
    this.disableHeartbeat = disableHeartbeat
    this.statusChangeListener = onStatusChange
  }

  /**
   *
   */
  public async connect(): Promise<unknown> {
    if (this.shouldConnect) {
      // resolve promise immediately if already connecting
      return Promise.resolve()
    }

    this.shouldConnect = true

    this.connectWebSocket()

    return new Promise((resolve, reject) => {
      this.connectPromiseHandler = { resolve, reject }
    })
  }

  public disconnect() {
    this.shouldConnect = false
    this.disconnectWebsocket()
  }

  public subscribe(
    params: WSConnectorTypes.WsSubscriptionParams | WSConnectorTypes.WsSubscriptionParams[],
    handler: WSSubscriber,
  ) {
    const channels: string[] = []
    if (!Array.isArray(params)) {
      params = [params] // eslint-disable-line no-param-reassign
    }

    for (const param of params as WSConnectorTypes.WsSubscriptionParams[]) {
      const channelId = generateChannelId(param)
      const shouldSubscribe = this.channelHandlers[channelId] === undefined
      this.channelHandlers[channelId] = handler

      if (shouldSubscribe) {
        channels.push(channelId)
      }
    }

    this.send('subscribe', { channels })
  }

  public unsubscribe(
    params: WSConnectorTypes.WsSubscriptionParams | WSConnectorTypes.WsSubscriptionParams[],
  ) {
    if (!Array.isArray(params)) {
      params = [params] // eslint-disable-line no-param-reassign
    }

    const channelIds: string[] = []
    for (const param of params) {
      const channelId = generateChannelId(param)
      delete this.channelHandlers[channelId]
    }

    this.send('unsubscribe', {
      channels: channelIds,
    })
  }

  public send(method: string, params: any) {
    this.sendMessage(JSON.stringify({
      id: `g${++this.requestIdCounter}`,
      method,
      params,
    }))
  }

  public async request<T = unknown>(method: string, params: any): Promise<WSResult<T>> {
    const requestId = `r${++this.requestIdCounter}`

    this.sendMessage(JSON.stringify({
      id: requestId,
      method,
      params,
    }))

    return new Promise((resolve, reject) => {
      this.requestHandlers[requestId] = { requestId, resolve, reject }
    })
  }

  private sendMessage(data: string | Buffer) {
    const socket = this.getSocket()
    this.debugLog('WSConnector.sendMessage', data)
    socket?.send(data)
  }

  private onOpen(ev: Event): any {
    this.debugLog('WSConnector.onOpen', ev)

    // clear timeout for killing connect attempts
    clearTimeout(this.timeoutConnect)

    this.connected = true
    this.connectPromiseHandler?.resolve()
    this.connectPromiseHandler = null

    this.updateConnectStatus()
    this.startHeartbeat()
  }

  private onMessage(ev: MessageEvent) {
    this.debugLog('WSConnector.onMessage', ev)

    if (ev.data === 'pong') {
      this.restartHeartbeatTimeout()
      return
    }

    const message = this.parseWsMessage<unknown>(ev)

    if (!message.requestId && message.channel) {
      const channelHandler = this.channelHandlers[message.channel]
      if (!channelHandler) {
        this.debugLog(`handler not found for channel: ${message.channel}`)
        this.unsubscribe({ channel: message.channel as WSConnectorTypes.WSChannel })
        return
      }

      channelHandler(message.result!)
      return
    }

    if (!message.requestId?.startsWith('r')) {
      return
    }

    const handler = this.requestHandlers[message.requestId]
    if (!handler) {
      this.debugLog(`handler not found for request: ${message.requestId}`)
      return
    }

    if (message.error) {
      handler.reject(message.error)
    } else {
      handler.resolve(message.result)
    }
    delete this.requestHandlers[message.requestId]
  }

  private onError(ev: Event) {
    this.debugLog('WSConnector.onError', ev)

    const handlers: PromiseHandler[] = Object.values(this.requestHandlers)
    console.error(ev)
    const error = new Error('WebSocket error occurred')
    for (const handler of handlers) {
      handler.reject(error)
      if (handler.requestId) {
        delete this.requestHandlers[handler.requestId]
      }
    }
  }

  private onClose(ev: Event) {
    this.debugLog('WSConnector.onClose', ev)

    this.disconnectWebsocket()
  }

  private getSocket() {
    if (!this.connected) {
      throw new Error('WebSocket not connected')
    }

    return this.websocket
  }

  private updateConnectStatus() {
    try {
      this.statusChangeListener?.(this.connected)
    } catch (error) {
      console.error(error)
    }
  }

  private sendHeartbeat() {
    this.websocket?.send('ping')
  }

  private restartHeartbeatTimeout() {
    clearTimeout(this.heartbeatTimeout)

    if (this.disableHeartbeat || this.timeoutHeartbeat <= 0) {
      // configured to disable heartbeat checks
      return
    }

    this.heartbeatTimeout = setTimeout(
      this.onHeartbeatTimeout.bind(this),
      this.timeoutHeartbeat,
    ) as unknown as number
  }

  private onHeartbeatTimeout() {
    this.debugLog('heartbeat timed out')
    console.warn('ws heartbeat missed, killing zombie connection')

    this.disconnect()
  }

  private startHeartbeat() {
    // call receive heartbeat to start timeout
    this.restartHeartbeatTimeout()

    if (this.disableHeartbeat || this.intervalHeartbeat <= 0) {
      // configured to disable heartbeat checks
      return
    }

    this.heartbeatInterval = setInterval(
      this.sendHeartbeat.bind(this),
      this.intervalHeartbeat,
    ) as unknown as number
  }

  private parseWsMessage<T>(ev: MessageEvent): WSMessage<T> {
    try {
      const { id, sequence_number: sequenceNumber, error, channel, ...rest } = JSON.parse(ev.data)
      const outOfSequence = sequenceNumber < this.sequenceNumberCache[channel]
      if (!outOfSequence) {
        this.sequenceNumberCache[channel] = sequenceNumber
      }

      return {
        requestId: id,
        channel,
        sequenceNumber,
        error: error as WSError,
        result: {
          requestId: id,
          channel,
          timestamp: new Date(),
          outOfSequence,
          data: rest,
        },
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  private rejectConnect(error: Error) {
    clearTimeout(this.initFailureTimeout)

    this.connectPromiseHandler?.reject(error)
    this.connectPromiseHandler = null
  }

  /**
   *
   */
  private disconnectWebsocket() {
    try {
      this.websocket?.close()
    } catch (e) {
      // ignore error on disconnect
    } finally {
      clearInterval(this.heartbeatInterval)
      clearTimeout(this.heartbeatTimeout)

      this.sequenceNumberCache = {}
      this.websocket = null
      if (this.connected) {
        this.connected = false

        this.updateConnectStatus()
      }
    }
  }

  /**
   *
   */
  private connectWebSocket() {
    this.disconnect()

    try {
      const websocket = new WebSocket(this.endpoint)
      websocket.onopen = this.onOpen.bind(this)
      websocket.onclose = this.onClose.bind(this)
      websocket.onerror = this.onError.bind(this)
      websocket.onmessage = this.onMessage.bind(this)

      this.websocket = websocket
      this.requestHandlers = {}

      // set timeout to kill websocket instantiation attempt
      // because error for constructor cannot be caught
      // i.e. new WebSocket(…)
      // https://stackoverflow.com/questions/22919638
      this.initFailureTimeout = setTimeout(() => {
        this.rejectConnect(new Error('websocket connect time out'))
      }, this.timeoutConnect) as unknown as number
    } catch (error) {
      this.rejectConnect(error)
    }
  }

  private debugLog(...args: any[]) {
    if (!this.debugMode) return

    logger(args)
  }
}
