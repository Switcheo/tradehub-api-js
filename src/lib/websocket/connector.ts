
import { logger } from '../utils'
// import {
//   WsSubscribeParams,
// } from './types'

import * as WSConnectorTypes from './types'

export { WSConnectorTypes }

export interface WSConnectorOptions {
  endpoint: string
}

interface PromiseHandler {
  resolve: (result?: unknown) => void
  reject: (reason?: any) => void
}

interface WSError {
  code: string
  message: string
}

interface WSResult<T extends unknown> {
  outOfSequence: boolean
  data: T
}
interface WSMessage<T extends unknown> {
  requestId: string
  sequenceNumber: number
  error?: WSError
  result?: WSResult<T>
}

interface PromiseHandlerCache {
  [index: string]: PromiseHandler
}

/**
 * 
 */
export default class WSConnector {
  endpoint: string
  websocket: WebSocket | null = null
  lastSequenceNumber: number = 0
  requestIdCounter: number = 0

  // true if connection initiated, even if connection is not established
  // will cause reconnect attempts if true.
  shouldConnect: boolean = false

  // true if connection is established
  connected: boolean = false



  connectPromiseHandler: PromiseHandler | null = null

  requestHandlers: PromiseHandlerCache = {}

  /**
   * 
   * @param options 
   */
  constructor(
    options: WSConnectorOptions,
  ) {
    this.endpoint = options.endpoint
  }

  /**
   * 
   */
  public async connect() {
    if (this.shouldConnect) return

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

  public send(method: string, params: any) {
    this.sendMessage(JSON.stringify({
      method,
      params,
    }))
  }

  public async request(method: string, params: any): Promise<unknown> {
    const requestId = `r${++this.requestIdCounter}`

    this.sendMessage(JSON.stringify({
      id: requestId,
      method,
      params,
    }))

    return new Promise((resolve, reject) => {
      this.requestHandlers[requestId] = { resolve, reject }
    })
  }

  private sendMessage(data: string | Buffer) {
    const socket = this.getSocket()
    logger('WSConnector.sendMessage', data)
    socket?.send(data)
  }

  private onOpen(ev: Event): any {
    logger('WSConnector.onOpen', ev)

    this.connected = true
    this.connectPromiseHandler?.resolve()
    this.connectPromiseHandler = null
  }

  private onMessage(ev: MessageEvent) {
    logger('WSConnector.onMessage', ev)

    const message = this.parseWsMessage<unknown>(ev)

    const handler = this.requestHandlers[message.requestId]
    if (!handler) {
      logger(`handler not found for request: ${message.requestId}`)
      return
    }

    if (message.error) {
      handler.reject(message.error)
      return
    }

    handler.resolve(message.result)

    delete this.requestHandlers[message.requestId]
  }

  private onError(ev: Event) {
    logger('WSConnector.onError', ev)

    const handlers: PromiseHandler[] = Object.values(this.requestHandlers)
    console.error(ev)
    const error = new Error(`WebSocket error occurred`)
    for (const handler of handlers) {
      handler.reject(error)
    }
  }

  private onClose(ev: Event) {
    logger('WSConnector.onClose', ev)

    this.disconnectWebsocket()
  }

  private getSocket() {
    if (!this.connected)
      throw new Error("WebSocket not connected")

    return this.websocket
  }

  private parseWsMessage<T>(ev: MessageEvent): WSMessage<T> {
    try {
      const { id, sequence_number, error, ...rest } = JSON.parse(ev.data)
      const outOfSequence = sequence_number < this.lastSequenceNumber
      if (!outOfSequence)
        this.lastSequenceNumber = sequence_number

      return {
        requestId: id,
        sequenceNumber: sequence_number,
        error: error as WSError,
        result: {
          outOfSequence: outOfSequence,
          data: rest,
        }
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   * 
   */
  private disconnectWebsocket() {
    try {
      this.websocket?.close()
      this.websocket = null
      this.connected = false
    } catch (e) { }
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
    } catch (error) {
      this.connectPromiseHandler?.reject(error)
      this.connectPromiseHandler = null
    }
  }
}
