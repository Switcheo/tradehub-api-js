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

  public async depositProposal(id: string, amount: TokenAmount[]) {
    const value: RPCParams.DepositProposalMsg = {
      proposal_id: id,
      depositor: this.getWallet().bech32Address,
      amount,
    };
    return await this.sendTx(
      TxTypes.Governance.DEPOSIT_PROPOSAL,
      value,
    );
  }

  public async voteProposal(id: string, option: string) {
    const value: RPCParams.VoteProposalMsg = {
      proposal_id: id,
      voter: this.getWallet().bech32Address,
      option,
    };
    return await this.sendTx(
      TxTypes.Governance.VOTE_PROPOSAL,
      value,
    );
  }
}

export default ModGovernance;
