import { BN_ONE } from "@lib/tradehub/utils";
import BaseModule from "./module";

class ModAdmin extends BaseModule {
  public async mintTokens(toAddress: string): Promise<unknown> {

    return this.getWallet().sendTx({
      type: "coin/MsgMintToken",
      value: {
        to_address: toAddress,
        amount: BN_ONE.shiftedBy(8),
        denom: "swth",
        originator: this.getWallet().bech32Address,
      },
    });
  }
}

export default ModAdmin;
