import * as types from '../types'
import { WalletClient }  from '../clients/wallet'

export async function createOrder(wallet: WalletClient, params: types.CreateOrderParams, options?: types.Options) {
  return createOrders(wallet, [params], options)
}

export async function createOrders(wallet: WalletClient, paramsList: types.CreateOrderParams[], options?: types.Options) {
  const address = wallet.pubKeyBech32
  const msgs = paramsList.map(params => ({
    OrderParams: JSON.stringify(params),
    Originator: address,
  }))
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.CREATE_ORDER_MSG_TYPE), options)
}


export async function cancelOrder(wallet: WalletClient, msg: types.CancelOrderParams, options?: types.Options) {
  return cancelOrders(wallet, [msg], options)
}

export async function cancelOrders(wallet: WalletClient, msgs: types.CancelOrderParams[], options?: types.Options) {
  msgs = msgs.map(msg => {
    if (!msg.originator) msg.originator = wallet.pubKeyBech32
    return msg
  })
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.CANCEL_ORDER_MSG_TYPE), options)
}


export async function editOrder(wallet: WalletClient, orderID: string, params: types.EditOrderParams, options?: types.Options) {
  return editOrders(wallet, [orderID], [params], options)
}

export async function editOrders(wallet: WalletClient, orderIDs: string[], paramsList: types.EditOrderParams[], options?: types.Options) {
  if (orderIDs.length != paramsList.length) throw new Error("orderIDs.length != paramsList.length")
  const address = wallet.pubKeyBech32
  const msgs = paramsList.map((params, i) => ({
    OrderID: orderIDs[i],
    EditOrderParams: JSON.stringify(params),
    Originator: address,
  }))
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.EDIT_ORDER_MSG_TYPE), options)
}

export async function cancelAll(wallet: WalletClient, msg: types.CancelAllMsg, options?: types.Options) {
  if (!msg.originator) msg.originator = wallet.pubKeyBech32
  return wallet.signAndBroadcast([msg], [types.CANCEL_ALL_MSG_TYPE], options)
}
