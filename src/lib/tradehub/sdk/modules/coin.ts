import { RPCParams } from "@lib/tradehub/models";
import { TxTypes } from "@lib/tradehub/utils";
import BaseModule from "./module";

class ModCoin extends BaseModule {
  public async withdraw(params: RPCParams.CreateWithdrawal) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Coin.CREATE_WITHDRAWAL_TYPE,
      value: params,
    });
  }

  public async send(params: RPCParams.SendToken, memo?: string) {
    const wallet = this.getWallet();

    if (!params.from_address)
      params.from_address = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Coin.SEND_TOKENS_TYPE,
      value: params,
    }, memo);
  }
}

export default ModCoin;
