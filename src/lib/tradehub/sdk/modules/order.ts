import { TxTypes } from "@lib/tradehub/utils";
import { CreateOrderMsg, CancelOrderMsg, EditOrderMsg, CancelAllMsg } from "@lib/types";
import BaseModule from "./module";

class ModOrder extends BaseModule {
  public async create(params: CreateOrderMsg) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;
    if (params.is_post_only === undefined)
      params.is_post_only = false
    if (params.is_reduce_only === undefined)
      params.is_reduce_only = false

    return await wallet.sendTx({
      type: TxTypes.Order.CREATE,
      value: params,
    });
  }

  public async createOrders(params: CreateOrderMsg[]) {
    const wallet = this.getWallet();

    const msgs = params.map(param => {
      if (!param.originator)
        param.originator = wallet.bech32Address;
      if (param.is_post_only === undefined)
        param.is_post_only = false
      if (param.is_reduce_only === undefined)
        param.is_reduce_only = false

      return {
        type: TxTypes.Order.CREATE,
        value: param,
      };
    })
    
    return await wallet.sendTxs(msgs);
  }

  public async cancel(params: CancelOrderMsg) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Order.CANCEL,
      value: params,
    });
  }

  public async cancelOrders(params: CancelOrderMsg[]) {
    const wallet = this.getWallet();

    const msgs = params.map(param => {
      if (!param.originator)
        param.originator = wallet.bech32Address;

      return {
        type: TxTypes.Order.CANCEL,
        value: params,
      };
    })

    return await wallet.sendTxs(msgs);
  }

  public async edit(params: EditOrderMsg) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Order.EDIT,
      value: params,
    });
  }

  public async editOrders(params: EditOrderMsg[]) {
    const wallet = this.getWallet();

    const msgs = params.map(param => {
      if (!param.originator)
        param.originator = wallet.bech32Address;

      return {
        type: TxTypes.Order.EDIT,
        value: params,
      };
    })

    return await wallet.sendTxs(msgs);
  }

  public async cancelAll(params: CancelAllMsg) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Order.CANCEL_ALL,
      value: params,
    });
  }
}

export default ModOrder;
