import { TxTypes } from "@lib/tradehub/utils";
import { CreateOrderMsg } from "@lib/types";
import BaseModule from "./module";

class ModOrder extends BaseModule {
  public async create(params: CreateOrderMsg) {
    const wallet = this.getWallet();

    return await wallet.sendTx({
      type: TxTypes.Order.CREATE,
      value: {
        ...params,
        originator: wallet.bech32Address,
      },
    });
  }
}

export default ModOrder;
