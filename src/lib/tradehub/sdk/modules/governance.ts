import { RPCParams } from "@lib/tradehub/models";
import { TokenAmount } from "@lib/tradehub/models/rest";
import { TxTypes } from "@lib/tradehub/utils";
import BaseModule from "./module";

class ModGovernance extends BaseModule {
  public async submitProposal<T = RPCParams.Proposal>(type: RPCParams.Proposal.Type | string, params: T, deposit: TokenAmount[] = []) {
    const value: RPCParams.SubmitProposalMsg<T> = {
      content: {
        type,
        value: params,
      },
      initial_deposit: deposit,
      proposer: this.getWallet().bech32Address,
    };
    return await this.sendTx(
      TxTypes.Governance.SUBMIT_PROPOSAL,
      value,
    );
  }
}

export default ModGovernance;
