import { TxTypes } from "@lib/tradehub/utils";
import BaseModule from "./module";

class ModAccount extends BaseModule {
  public async updateProfile(username: string, twitter: string): Promise<unknown> {
    const wallet = this.getWallet();

    return wallet.sendTx({
      type: TxTypes.Account.UPDATE_PROFILE,
      value: {
        username,
        twitter,
        originator: wallet.bech32Address,
      },
    });
  }
}

export default ModAccount;
