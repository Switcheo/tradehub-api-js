export interface TradeHubSigner {
  type: TradeHubSigner.Types

  // signs the cosmos StdSignDoc.toJSON, returns signature buffer
  sign: (doc: string) => Promise<Buffer>
}

export namespace TradeHubSigner {
  export enum Types {
    Ledger,
    PrivateKey,
    BrowserInjected,
  }
}
