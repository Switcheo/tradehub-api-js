import BigNumber from "bignumber.js";
import { BN_ONE, BN_ZERO, DEFAULT_GAS, ONE_SWTH, TxFeeTypeDefaultKey } from "./constants";
import { sortObject } from "./misc";
import { SimpleMap } from "./types";

export interface TxMsgValue { }
export interface TxMsg<T extends TxMsgValue = TxMsgValue> {
  type: string
  value: T
}

export class DenomAmount {
  constructor(
    public readonly amount: BigNumber,
    public readonly denom: string = "swth",
  ) { }

  toJSON() {
    return {
      denom: this.denom,
      amount: this.amount.toString(10),
    }
  }
}
export class TxFee {
  constructor(
    public readonly amount: [DenomAmount],
    public readonly gas: BigNumber,
  ) { }

  toJSON() {
    return {
      amount: this.amount,
      gas: this.gas.toString(10),
    }
  }
}

export const DEFAULT_FEE = new TxFee(
  [new DenomAmount(BN_ONE)],
  DEFAULT_GAS,
);

export class PreSignDoc {
  public msgs: TxMsg[] = []

  constructor(
    public readonly chainId: string,
    public readonly memo: string = "",
    public fee: TxFee = DEFAULT_FEE,
  ) { }

  public appendMsg(...msgs: TxMsg[]): PreSignDoc {
    this.msgs.splice(msgs.length, 0, ...msgs);
    return this;
  }

  public updateFees(feeMap?: SimpleMap<BigNumber>): PreSignDoc {
    let totalFees = BN_ZERO;
    for (const msg of this.msgs) {
      const msgFee = feeMap?.[msg.type] ?? feeMap?.[TxFeeTypeDefaultKey] ?? ONE_SWTH
      totalFees = totalFees.plus(msgFee);
    }
    this.fee = new TxFee([new DenomAmount(totalFees)], DEFAULT_GAS);
    return this;
  }

  public prepare(accountNumber: number, sequence: number): StdSignDoc {
    return new StdSignDoc(
      accountNumber,
      sequence,
      this.chainId,
      this.msgs,
      this.fee,
      this.memo,
    );
  }
}

export class StdSignDoc {
  constructor(
    public readonly account_number: number,
    public readonly sequence: number,
    public readonly chain_id: string,
    public readonly msgs: TxMsg[],
    public readonly fee: TxFee = DEFAULT_FEE,
    public readonly memo: string = "",
  ) { }

  public sortedJson(): string {
    const json = JSON.parse(JSON.stringify({
      chain_id: this.chain_id,
      account_number: this.account_number.toString(),
      sequence: this.sequence.toString(),
      fee: this.fee,
      msgs: this.msgs,
      memo: this.memo,
    }))
    const sortedDoc = sortObject(json);
    return JSON.stringify(sortedDoc);
  }
}

export interface TradeHubSignature {
  pub_key: {
    type: string;
    value: string;
  };
  signature: string;
}

export interface TradeHubTx {
  fee: TxFee;
  msg: TxMsg[];
  memo: string;
  signatures: TradeHubSignature[];
}

export interface BroadcastTx {
  mode: string;
  tx: TradeHubTx;
}

export interface TxRequest {
  msg: TxMsg;
  promise: Promise<TxResponse>;
}

export interface TxLog {
  msg_index: number;
  log: string;
  events: unknown[]
}

export interface TxResponse {
  height: string;
  txhash: string;
  raw_log: string;

  gas_wanted: string;
  gas_used: string;

  // only if tx succeeds
  logs: TxLog[];

  // only if tx fails
  code?: number;
  error?: string;
  codespace?: string;
}
