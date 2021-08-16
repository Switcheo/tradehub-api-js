import { StdSignDoc } from "../utils";

export interface TradeHubSigner {
  type: TradeHubSigner.Type

  // signs the cosmos StdSignDoc.toJSON, returns signature buffer
  sign: (doc: StdSignDoc) => Promise<Buffer>
}

export namespace TradeHubSigner {
  export enum Type {
    Ledger,
    PrivateKey,
    PublicKey,
    BrowserInjected,
  }
}
