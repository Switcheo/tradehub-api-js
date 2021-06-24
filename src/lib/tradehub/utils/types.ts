
export type Bech32Type = "main" | "validator" | "consensus"

export interface SimpleMap<T = string> {
  [index: string]: T
}
