import { TxTypes } from "@lib/tradehub/utils";
import { SetLeverageMsg } from "@lib/types";
import BaseModule from "./module";

class ModLeverage extends BaseModule {
  public async set(params: SetLeverageMsg) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Leverage.SET_LEVERAGE,
      value: params,
    });
  }

  public async setLeverages(params: SetLeverageMsg[]) {
    const wallet = this.getWallet();

    const msgs = params.map(param => {
      if (!param.originator)
        param.originator = wallet.bech32Address;

      return {
        type: TxTypes.Leverage.SET_LEVERAGE,
        value: param,
      };
    })
    
    return await wallet.sendTxs(msgs);
  }
}

export default ModLeverage;
