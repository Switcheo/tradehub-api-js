export enum TradeHubSignerTypes {
  Ledger,
  PrivateKey,
}

export interface TradeHubSigner {
  type: TradeHubSignerTypes

  // signs the cosmos StdSignDoc.toJSON, returns signature buffer
  sign: (doc: string) => Promise<Buffer>
}
