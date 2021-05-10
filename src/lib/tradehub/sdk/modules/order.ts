import { TxTypes } from "@lib/tradehub/utils";
import { CreateOrderMsg } from "@lib/types";
import BaseModule from "./module";

class ModOrder extends BaseModule {
  public async create(params: CreateOrderMsg) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Order.CREATE,
      value: params,
    });
  }
}

export default ModOrder;
