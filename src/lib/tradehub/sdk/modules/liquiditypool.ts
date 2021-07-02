import { RPCParams } from "@lib/tradehub/models";
import { TxTypes } from "@lib/tradehub/utils";
import BaseModule from "./module";

class ModLiquidityPool extends BaseModule {
  public async create(params: RPCParams.CreatePool) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.LiquidityPool.CREATE_POOL,
      value: params,
    });
  }

  public async createWithLiquidity(params: RPCParams.CreatePoolWithLiquidity) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.LiquidityPool.CREATE_POOL_WITH_LIQUIDITY,
      value: params,
    });
  }

  public async addLiquidity(params: RPCParams.AddLiquidity) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.LiquidityPool.ADD_LIQUIDITY,
      value: params,
    });
  }

  public async removeLiquidity(params: RPCParams.RemoveLiquidity) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.LiquidityPool.REMOVE_LIQUIDITY,
      value: params,
    });
  }

  public async stakePoolToken(params: RPCParams.StakePoolToken) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.LiquidityPool.STAKE_POOL_TOKEN,
      value: params,
    });
  }

  public async unstakePoolToken(params: RPCParams.UnstakePoolToken) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.LiquidityPool.UNSTAKE_POOL_TOKEN,
      value: params,
    });
  }

  public async claimPoolRewards(params: RPCParams.ClaimPoolRewards) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.LiquidityPool.CLAIM_POOL_REWARDS,
      value: params,
    });
  }

}

export default ModLiquidityPool;
