// tslint:disable:max-classes-per-file
export class StdSignDoc {
  // tslint:disable-next-line: variable-name
  public readonly chain_id: string
  // tslint:disable-next-line: variable-name
  public readonly account_number: string
  public readonly sequence: string
  public readonly fee: string
  public readonly msgs: string
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

export class Fee {
  public readonly amount: string
  public readonly gas: string

  constructor(amount, gas) {
    this.amount = amount
    this.gas = gas
  }
}
