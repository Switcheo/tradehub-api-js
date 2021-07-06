import { RPCParams } from "@lib/tradehub/models";
import { TxTypes } from "@lib/tradehub/utils";
import BaseModule from "./module";

class ModAccount extends BaseModule {
  public async updateProfile(params : RPCParams.UpdateProfile) {
    const wallet = this.getWallet();


    if (!params.originator)
      params.originator = wallet.bech32Address;

    return wallet.sendTx({
      type: TxTypes.Account.UPDATE_PROFILE,
      value: params
    });
  }

  public async create(params: RPCParams.CreateSubAccount) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Account.CREATE_SUB_ACCOUNT,
      value: params,
    });
  }

  public async activate(params: RPCParams.ActivateSubAccount) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Account.ACTIVATE_SUB_ACCOUNT,
      value: params,
    });
  }
}

export default ModAccount;
