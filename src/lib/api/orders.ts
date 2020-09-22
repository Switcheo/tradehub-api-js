import * as types from '../types'
import { Wallet, SignMessageOptions } from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions { }

export interface CreateOrderParams {
  OrderType?: string,
  StopPrice?: string,
  TriggerType?: string,
  Market: string,
  Side: string,
  Quantity: string,
  Price: string,
  IsReduceOnly?: boolean,
  IsPostOnly?: boolean,
}

export async function createOrder(wallet: Wallet, params: CreateOrderParams, options?: Options) {
  return createOrders(wallet, [params], options)
}

export async function createOrders(wallet: Wallet, paramsList: CreateOrderParams[], options?: Options) {
  const address = wallet.pubKeyBech32
  const msgs = paramsList.map(params => ({
    OrderParams: JSON.stringify(params),
    Originator: address,
  }))
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.CREATE_ORDER_MSG_TYPE), options)
}

export interface CancelOrderMsg {
  order_id: string,
  originator?: string,
}

export async function cancelOrder(wallet: Wallet, msg: CancelOrderMsg, options?: Options) {
  return cancelOrders(wallet, [msg], options)
}

export async function cancelOrders(wallet: Wallet, msgs: CancelOrderMsg[], options?: Options) {
  msgs = msgs.map(msg => {
    if (!msg.originator) msg.originator = wallet.pubKeyBech32
    return msg
  })
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.CANCEL_ORDER_MSG_TYPE), options)
}

export interface EditOrderParams {
  StopPrice?: string,
  Quantity?: string,
  Price?: string,
}

export async function editOrder(wallet: Wallet, orderID: string, params: EditOrderParams, options?: Options) {
  return editOrders(wallet, [orderID], [params], options)
}

export async function editOrders(wallet: Wallet, orderIDs: string[], paramsList: EditOrderParams[], options?: Options) {
  if (orderIDs.length != paramsList.length) throw new Error("orderIDs.length != paramsList.length")
  const address = wallet.pubKeyBech32
  const msgs = paramsList.map((params, i) => ({
    OrderID: orderIDs[i],
    EditOrderParams: JSON.stringify(params),
    Originator: address,
  }))
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.EDIT_ORDER_MSG_TYPE), options)
}


export interface CancelAllMsg {
  market: string,
  originator?: string,
}



export async function cancelAll(wallet: Wallet, msg: CancelAllMsg, options?: Options) {
  if (!msg.originator) msg.originator = wallet.pubKeyBech32
  return wallet.signAndBroadcast([msg], [types.CANCEL_ALL_MSG_TYPE], options)
}