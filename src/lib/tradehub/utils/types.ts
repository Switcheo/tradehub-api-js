export type Bech32Type = "main" | "validator" | "consensus"

export class Fee {
  constructor(
    public readonly amount: string,
    public readonly gas: string,
  ) { }
}

export interface SimpleMap<T> {
  [index: string]: T
}
