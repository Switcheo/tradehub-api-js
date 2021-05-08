import { StdSignDoc } from "@lib/containers";

export enum TradeHubSignerTypes {
  Ledger,
  PrivateKey,
}

export interface TradeHubSigner {
  type: TradeHubSignerTypes
  // signs the cosmos StdSignDoc, returns signature buffer
  sign: (doc: StdSignDoc) => Buffer
}
