import { RestModels, RPCParams } from "@lib/tradehub/models";
import { TxTypes } from "@lib/tradehub/utils";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
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

  public async estimateUnclaimedRewards(params: RPCParams.EstimateUnclaimedRewardsMsg): Promise<RestModels.UnclaimedRewards> {
    const sdk = this.sdkProvider;
    const accruedRewards: RestModels.UnclaimedRewards = {};
    const lastClaimed = await sdk.api.getLastClaimedPoolReward(params);
    let lastHeight = lastClaimed.result;
    
    const allocation = await sdk.api.getRewardHistory({
      poolId: params.poolId,
      blockHeight: new BigNumber(lastClaimed.result || '0').plus(1).toString()
    });
    
    // get current share
    const shares = await sdk.api.getStakedPoolTokenInfo({
      pool_id: parseInt(params.poolId),
      account: params.address,
    });
    
    const commitmentPower = new BigNumber(shares.result.commitment_power || '0');
    
    // calculate accrued rewards based on history
    if (!commitmentPower.isZero() && allocation && allocation.result) {
      allocation.result.forEach((period) => {
        lastHeight = period.BlockHeight;
        const totalCommit = new BigNumber(period.TotalCommitment);
        const ratio = commitmentPower.div(totalCommit);
        period.Rewards?.forEach((reward) => {
          const rewardCut = new BigNumber(reward.amount).times(ratio).integerValue(BigNumber.ROUND_DOWN);
          if (reward.denom in accruedRewards) {
            accruedRewards[reward.denom] = accruedRewards[reward.denom].plus(rewardCut);
          } else {
            accruedRewards[reward.denom] = rewardCut;
          }
        });
      });
    }
    // Estimate rewards from last allocated rewards
    // the current logic will under estimate the rewards as the current weekly reward rate is used across the full period
    // instead of deriving the reward rate for each week since the last reward allocation
    
    if (!commitmentPower.isZero()) {
      const weeklyRewards = await sdk.api.getWeeklyPoolRewards();
      const pools = await sdk.api.getLiquidityPools();
      const pool = pools.find((pool) => pool.pool_id === parseInt(params.poolId));
      const currentTotalCommitmentPower = new BigNumber(pool.total_commitment || '0');
      const poolWeight = new BigNumber(pool.rewards_weight || '0');
      let totalWeight = new BigNumber(0);
      pools.forEach((pool) => {
        totalWeight = totalWeight.plus(pool.rewards_weight);
      });
      const poolWeekRewards = poolWeight.dividedBy(totalWeight).times(weeklyRewards);
    
      // get time from last height
      const blockInfo = await sdk.api.getCosmosBlockInfo({ height: parseInt(lastHeight) + 1 });
    
      const estimatedStart = dayjs(blockInfo.block.header.time);
    
      const now = dayjs();
      const WEEKS_IN_SECONDS = 604800;
      const diff = now.diff(estimatedStart, 'second');
    
      const estimatedRewards = new BigNumber(diff / WEEKS_IN_SECONDS).times(poolWeekRewards)
        .times(commitmentPower).div(currentTotalCommitmentPower)
        .shiftedBy(8).integerValue(BigNumber.ROUND_DOWN);
      if ('swth' in accruedRewards) {
        accruedRewards['swth'] = accruedRewards['swth'].plus(estimatedRewards);
      } else {
        accruedRewards['swth'] = estimatedRewards;
      }
    }
    return accruedRewards;
  }
}

export default ModLiquidityPool;
