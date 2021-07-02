import { RPCParams } from "@lib/tradehub/models";
import { TxTypes } from "@lib/tradehub/utils";
import BaseModule from "./module";

class ModCDP extends BaseModule {
  public async addCollateral(params: RPCParams.AddCollateral) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.CDP.ADD_COLLATERAL,
      value: params,
    });
  }

  public async removeCollateral(params: RPCParams.RemoveCollateral) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.CDP.REMOVE_COLLATERAL,
      value: params,
    });
  }

  public async addDebt(params: RPCParams.AddDebt) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.CDP.ADD_DEBT,
      value: params,
    });
  }

  public async removeDebt(params: RPCParams.RemoveDebt) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.CDP.REMOVE_DEBT,
      value: params,
    });
  }
}

export default ModCDP;
