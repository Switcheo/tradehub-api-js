import { StdSignDoc } from "@lib/containers";
import { Network } from "@lib/types";
import { stringOrBufferToBuffer, SWTHAddress } from "@lib/utils";
import secp256k1 from 'secp256k1';
import { sha256 } from 'sha.js';
import { TradeHubSigner, TradeHubSignerTypes } from "./TradeHubSigner";

export type TradeHubWalletInitOpts = {
  network?: Network
  debugMode?: boolean
} & ({
  // connect with mnemonic
  mnemonic: string
  privateKey?: string | Buffer
  signer?: TradeHubSigner
  bech32Address?: string
} | {
  // connect with private key
  mnemonic?: string
  privateKey: string | Buffer
  signer?: TradeHubSigner
  bech32Address?: string
} | {
  // connect with custom signer
  mnemonic?: string
  privateKey?: string | Buffer
  signer: TradeHubSigner
  bech32Address: string
})

const sortObject = (input: any): unknown => {
  if (typeof input !== "object") return input
  if (Array.isArray(input)) return input.map(sortObject)

  const output = {}
  Object.keys(input)
    .sort()
    .forEach((key) => output[key] = sortObject(input[key]))

  return output
}

class TradeHubMnemonicSigner implements TradeHubSigner {
  type = TradeHubSignerTypes.PrivateKey

  sign(doc: StdSignDoc): Buffer {
    const msg = Buffer.from(JSON.stringify(sortObject(doc)))
    const result = secp256k1.ecdsaSign(
      Buffer.from(new sha256().update(msg).digest()),
      Buffer.from(this.privateKey),
    )
    return Buffer.from(result.signature)
  }

  constructor(
    readonly privateKey: Buffer
  ) { }
}

export class TradeHubWallet {
  network: Network
  debugMode: boolean
  mnemonic?: string
  privateKey?: Buffer
  signer: TradeHubSigner
  bech32Address: string

  constructor(opts: TradeHubWalletInitOpts) {
    this.network = opts.network ?? Network.MainNet
    this.debugMode = opts.debugMode ?? false
    this.mnemonic = opts.mnemonic
    if (this.mnemonic) {
      this.privateKey = SWTHAddress.mnemonicToPrivateKey(this.mnemonic)
    } else if (opts.privateKey) {
      this.privateKey = stringOrBufferToBuffer(opts.privateKey)
    }

    if (opts.signer) {
      this.signer = opts.signer!
      this.bech32Address = opts.bech32Address
    } else if (this.privateKey) {
      this.signer = new TradeHubMnemonicSigner(this.privateKey)
      this.bech32Address = SWTHAddress.privateKeyToAddress(this.privateKey)
    } else {
      throw new Error("cannot instantiate wallet signer")
    }
  }

  public updateNetwork(network: Network): TradeHubWallet {
    this.network = network

    return this
  }

  public static initWithPrivateKey(privateKey: string | Buffer, opts: Omit<TradeHubWalletInitOpts, "privateKey"> = {}) {
    return new TradeHubWallet({
      ...opts,
      privateKey,
    })
  }

  public static initWithMnemonic(mnemonic: string, opts: Omit<TradeHubWalletInitOpts, "mnemonic"> = {}) {
    return new TradeHubWallet({
      ...opts,
      mnemonic,
    })
  }

  public static initWithSigner(signer: TradeHubSigner, bech32Address: string, opts: Omit<TradeHubWalletInitOpts, "signer"> = {}) {
    return new TradeHubWallet({
      ...opts,
      signer,
      bech32Address,
    })
  }
}
