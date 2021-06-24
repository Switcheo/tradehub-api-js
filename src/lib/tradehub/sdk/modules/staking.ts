import { TxTypes } from "@lib/tradehub/utils";
import { types } from "index";
import BaseModule from "./module";

class ModStaking extends BaseModule {
  public async delegateTokens(msg: types.DelegateTokensMsg) {
    const wallet = this.getWallet();
    return await wallet.sendTx({
      type: TxTypes.Staking.DELEGATE_TOKENS,
      value: msg
    })
  }
}

export default ModStaking;
