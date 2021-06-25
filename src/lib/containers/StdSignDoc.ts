// tslint:disable:max-classes-per-file
export class StdSignDoc {
  // tslint:disable-next-line: variable-name
  public readonly chain_id: string
  // tslint:disable-next-line: variable-name
  public readonly account_number: string
  public readonly sequence: string
  public readonly fee: StdFee
  public readonly msgs: any
  public readonly memo: string

  constructor({
    chainId,
    accountNumber,
    sequence,
    fee,
    msgs,
    memo,
  }) {
    this.chain_id = chainId
    this.account_number = accountNumber
    this.sequence = sequence
    this.fee = fee
    this.msgs = msgs
    this.memo = memo
  }
}
export interface Coin {
  readonly denom: string;
  readonly amount: string;
}

export interface StdFee {
  readonly amount: readonly Coin[];
  readonly gas: string;
}

export interface StdSignature {
  readonly pub_key: PubKey;
  readonly signature: string;
}
export interface PubKey {
  readonly type: string;
  readonly value: string;
}
