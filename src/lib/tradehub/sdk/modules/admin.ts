import { BN_ONE, TxTypes } from "@lib/tradehub/utils";
import { CreateTokenMsg } from "@lib/types";
import BaseModule from "./module";

class ModAdmin extends BaseModule {
  public async mintTokens(toAddress: string): Promise<unknown> {

    return this.getWallet().sendTx({
      type: TxTypes.Coin.MINT_TOKEN,
      value: {
        to_address: toAddress,
        amount: BN_ONE.shiftedBy(8),
        denom: "swth",
        originator: this.getWallet().bech32Address,
      },
    });
  }

  public async createToken(params: CreateTokenMsg): Promise<unknown> {

    return this.getWallet().sendTx({
      type: TxTypes.Coin.CREATE_TOKEN,
      value: params,
    });
  }
}

export default ModAdmin;
