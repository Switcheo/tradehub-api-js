import { RPCParams } from "@lib/tradehub/models";
import { TxTypes } from "@lib/tradehub/utils";
import BaseModule from "./module";

class ModBroker extends BaseModule {
  public async initiateLiquidation(params: RPCParams.InitiateLiquidation) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Broker.INITIATE_LIQUIDATION,
      value: params,
    });
  }

  public async initiateLiquidations(params: RPCParams.InitiateLiquidation[]) {
    const wallet = this.getWallet();

    const msgs = params.map(param => {
      if (!param.originator)
        param.originator = wallet.bech32Address;

      return {
        type: TxTypes.Broker.INITIATE_LIQUIDATION,
        value: param,
      };
    })
    
    return await wallet.sendTxs(msgs);
  }
}

export default ModBroker;
