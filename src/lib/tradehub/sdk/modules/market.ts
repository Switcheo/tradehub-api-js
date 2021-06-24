import { RPCParams } from "@lib/tradehub/models";
import { TxTypes } from "@lib/tradehub/utils";
import BaseModule from "./module";

class ModMarket extends BaseModule {
  public async create(params: RPCParams.CreateMarket) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await this.sendTx(
      TxTypes.Market.CREATE,
      params,
    );
  }
}

export default ModMarket;
