import { RPCParams } from "@lib/tradehub/models";
import { TokenAmount } from "@lib/tradehub/models/rest";
import { TxTypes } from "@lib/tradehub/utils";
import BaseModule from "./module";

class ModGovernance extends BaseModule {
  public async submitProposal<T = RPCParams.Proposal>(type: string, deposit: TokenAmount[], proposer: string, params: T) {
    const value: RPCParams.SubmitProposalMsg<T> = {
      content: {
        type,
        value: params,
      },
      initial_deposit: deposit,
      proposer,
    };
    return await this.sendTx(
      TxTypes.Governance.SUBMIT_PROPOSAL,
      value,
    );
  }
}

export default ModGovernance;
