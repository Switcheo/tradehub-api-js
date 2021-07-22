import { RPCParams } from "@lib/tradehub/models";
import { BN_ONE, TxTypes } from "@lib/tradehub/utils";
import BigNumber from "bignumber.js";
import BaseModule from "./module";

class ModAdmin extends BaseModule {
  public async mintTokens(toAddress: string, amount: BigNumber = BN_ONE.shiftedBy(8), denom: string = 'swth'): Promise<unknown> {

    return this.getWallet().sendTx({
      type: TxTypes.Coin.MINT_TOKEN,
      value: {
        to_address: toAddress,
        amount,
        denom,
        originator: this.getWallet().bech32Address,
      },
    });
  }

  public async createToken(params: RPCParams.CreateToken): Promise<unknown> {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return this.getWallet().sendTx({
      type: TxTypes.Coin.CREATE_TOKEN,
      value: params,
    });
  }

  public async createTokens(params: RPCParams.CreateToken[]) {
    const wallet = this.getWallet();

    const msgs = params.map(param => {
      if (!param.originator)
        param.originator = wallet.bech32Address;

      return {
        type: TxTypes.Coin.CREATE_TOKEN,
        value: param,
      };
    })
    
    return await wallet.sendTxs(msgs);
  }

  public async syncToken(params: RPCParams.SyncToken) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Coin.SYNC_TOKEN,
      value: params,
    });
  }

  public async createMarket(params: RPCParams.CreateMarket) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await this.sendTx(
      TxTypes.Market.CREATE,
      params,
    );
  }

  public async createMarkets(params: RPCParams.CreateMarket[]) {
    const wallet = this.getWallet();

    const msgs = params.map(param => {
      if (!param.originator)
        param.originator = wallet.bech32Address;

      return {
        type: TxTypes.Market.CREATE,
        value: param,
      };
    })
    
    return await wallet.sendTxs(msgs);
  }

  public async createVaultType(params: RPCParams.CreateVaultType) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.CDP.CREATE_VAULT_TYPE,
      value: params,
    });
  }

  public async linkPool(params: RPCParams.LinkPool) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.LiquidityPool.LINK_POOL,
      value: params,
    });
  }

  public async unlinkPool(params: RPCParams.UnlinkPool) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.LiquidityPool.UNLINK_POOL,
      value: params,
    });
  }

  public async changeSwapFee(params: RPCParams.ChangeSwapFee) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.LiquidityPool.CHANGE_SWAP_FEE,
      value: params,
    });
  }

  public async setRewardsWeights(params: RPCParams.SetRewardsWeights) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.LiquidityPool.SET_REWARDS_WEIGHTS,
      value: params,
    });
  }

  public async setRewardCurve(params: RPCParams.SetRewardCurve) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.LiquidityPool.SET_REWARD_CURVE,
      value: params,
    });
  }

  public async setCommitmentCurve(params: RPCParams.SetCommitmentCurve) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.LiquidityPool.SET_COMMITMENT_CURVE,
      value: params,
    });
  }

  public async setTradingFlag(params: RPCParams.SetTradingFlag) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Order.SET_TRADING_FLAG,
      value: params,
    });
  }

  public async setMsgFee(params: RPCParams.SetMsgFee) {
    const wallet = this.getWallet();

    if (!params.originator)
      params.originator = wallet.bech32Address;

    return await wallet.sendTx({
      type: TxTypes.Fee.SET_MESSAGE_FEE_TYPE,
      value: params,
    });
  }
}

export default ModAdmin;
