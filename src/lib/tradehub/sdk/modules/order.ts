import { TxTypes } from "@lib/tradehub/utils";
import { CreateOrderMsg } from "@lib/types";
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
}

export default ModOrder;
