import { Network } from "./network";

export type Bech32Type = "main" | "validator" | "consensus";

export interface SimpleMap<T = string> {
  [index: string]: T;
}
export interface NetworkMap<T> {
  [Network.MainNet]: T;
  [Network.TestNet]: T;
  [Network.DevNet]: T;
  [Network.LocalHost]: T;
}

export type OptionalNetworkMap<T> = Partial<NetworkMap<T>>;
