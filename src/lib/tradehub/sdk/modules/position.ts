import { RPCParams } from "@lib/tradehub/models";
import { TxTypes } from "@lib/tradehub/utils";
import BaseModule from "./module";

class ModPosition extends BaseModule {
  public async editMargin(params: RPCParams.EditMargin) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Position.EDIT_MARGIN,
      value: params,
    });
  }

  public async editMargins(params: RPCParams.EditMargin[]) {
    const wallet = this.getWallet();

    const msgs = params.map(param => {
      if (!param.originator)
        param.originator = wallet.bech32Address;

      return {
        type: TxTypes.Position.EDIT_MARGIN,
        value: param,
      };
    })
    
    return await wallet.sendTxs(msgs);
  }
}

export default ModPosition;
