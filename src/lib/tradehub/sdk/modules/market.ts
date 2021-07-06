import { RPCParams } from "@lib/tradehub/models";
import { TxTypes } from "@lib/tradehub/utils";
import BaseModule from "./module";

class ModMarket extends BaseModule {

  public async update(params: RPCParams.UpdateMarket) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await this.sendTx(
      TxTypes.Market.UPDATE,
      params,
    );
  }
}

export default ModMarket;
