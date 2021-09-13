import { TxMsg, TxTypes } from "@lib/tradehub/utils";
import * as types from "@lib/types";
import BaseModule from "./module";

class ModStaking extends BaseModule {
  public async delegateTokens(msg: types.DelegateTokensMsg) {
    const wallet = this.getWallet();
    return await wallet.sendTx({
      type: TxTypes.Staking.DELEGATE_TOKENS,
      value: msg
    })
  }

  public async unbondTokens(msg: types.BeginUnbondingTokensMsg) {
    const wallet = this.getWallet();
    return wallet.sendTx({
      type: TxTypes.Staking.BEGIN_UNBONDING_TOKENS,
      value: msg
    })
  }

  public async redelegateTokens(msg: types.BeginRedelegatingTokensMsg) {
    const wallet = this.getWallet();
    return wallet.sendTx({
      type: TxTypes.Staking.BEGIN_REDELEGATING_TOKENS,
      value: msg
    })
  }

  public async withdrawAllDelegatorRewards(msg: types.WithdrawAllDelegatorRewardsParams) {
    const { validatorAddresses, delegatorAddress } = msg
    const wallet = this.getWallet();
    const messages: TxMsg[] =
      validatorAddresses.map((address: string) => (
        {
          type: TxTypes.Staking.WITHDRAW_DELEGATOR_REWARDS,
          value: { validator_address: address, delegator_address: delegatorAddress }
        }
      ))

    return wallet.sendTxs(messages)
  }
}

export default ModStaking;
