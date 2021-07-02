import { RPCParams } from "@lib/tradehub/models";
import { TxTypes } from "@lib/tradehub/utils";
import BaseModule from "./module";

class ModOracle extends BaseModule {
  public async createVote(params: RPCParams.CreateVote) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await this.sendTx(
      TxTypes.Oracle.CREATE_VOTE_TYPE,
      params,
    );
  }
}

export default ModOracle;
