import { BigNumber } from 'bignumber.js'

import { CONFIG } from '../config'
import { TransactionOptions, Fee } from '../types'

export interface ConcreteMsg {
  type: string
  value: object
}
interface Signature {
  pub_key: {
    type: string
    value: string
  },
  signature: string,
}
interface Tx {
  fee: Fee
  msg: ReadonlyArray<ConcreteMsg>
  memo?: string
  signatures: ReadonlyArray<any> // TODO: fix any
}

export class Transaction {
  public readonly fee: Fee
  public readonly mode: string
  public readonly tx: Tx

  constructor(msgs: ConcreteMsg[], signatures: Signature[], options: TransactionOptions = {}) {
    const fee = options.fee || new Fee([{denom: "swth", amount: (new BigNumber(msgs.length)).shiftedBy(8).toString()}], CONFIG.DEFAULT_GAS)
    this.mode = options.mode || 'block'
    this.tx = {
      fee,
      msg: msgs,
      signatures,
    }
    if (options.memo) {
      this.tx = {
        ...this.tx,
        memo: options.memo,
      }
    }
  }
}
