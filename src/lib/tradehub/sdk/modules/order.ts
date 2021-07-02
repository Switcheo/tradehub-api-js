import { RPCParams } from "@lib/tradehub/models";
import { TxTypes } from "@lib/tradehub/utils";
import BaseModule from "./module";

class ModOrder extends BaseModule {
  public async create(params: RPCParams.CreateOrder) {
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

  public async createOrders(params: RPCParams.CreateOrder[]) {
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

  public async cancel(params: RPCParams.CancelOrder) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Order.CANCEL,
      value: params,
    });
  }

  public async cancelOrders(params: RPCParams.CancelOrder[]) {
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

  public async edit(params: RPCParams.EditOrder) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Order.EDIT,
      value: params,
    });
  }

  public async editOrders(params: RPCParams.EditOrder[]) {
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

  public async cancelAll(params: RPCParams.CancelAll) {
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
