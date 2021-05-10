import { Network } from "@lib/types";
import { stringOrBufferToBuffer, SWTHAddress } from "@lib/utils";
import secp256k1 from 'secp256k1';
import { sha256 } from 'sha.js';
import { APIClient } from "../api";
import { RestResponse } from "../models";
import { NetworkConfig, NetworkConfigs, PreSignDoc, StdSignDoc, TradeHubSignature, TradeHubTx, TxMsg, TxRequest } from "../utils";
import { TradeHubSigner, TradeHubSignerTypes } from "./TradeHubSigner";

export type TradeHubWalletInitOpts = {
  debugMode?: boolean
  network?: Network
} & ({
  // connect with mnemonic
  mnemonic: string
  privateKey?: string | Buffer
  signer?: TradeHubSigner
  publicKeyBase64?: string
} | {
  // connect with private key
  mnemonic?: string
  privateKey: string | Buffer
  signer?: TradeHubSigner
  publicKeyBase64?: string
} | {
  // connect with custom signer
  mnemonic?: string
  privateKey?: string | Buffer
  signer: TradeHubSigner
  publicKeyBase64: string
})

class TradeHubMnemonicSigner implements TradeHubSigner {
  type = TradeHubSignerTypes.PrivateKey

  sign(message: string): Buffer {
    const msg = Buffer.from(message)
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
  api: APIClient

  mnemonic?: string
  privateKey?: Buffer
  signer: TradeHubSigner
  bech32Address: string

  // required for signature generation
  pubKeyBase64: string

  account?: number
  sequence?: number

  constructor(opts: TradeHubWalletInitOpts) {
    this.debugMode = opts.debugMode ?? false

    this.updateNetwork(opts.network ?? Network.MainNet);

    this.mnemonic = opts.mnemonic
    if (this.mnemonic) {
      this.privateKey = SWTHAddress.mnemonicToPrivateKey(this.mnemonic)
    } else if (opts.privateKey) {
      this.privateKey = stringOrBufferToBuffer(opts.privateKey)
    }

    if (opts.signer) {
      this.signer = opts.signer
      this.pubKeyBase64 = opts.publicKeyBase64
    } else if (this.privateKey) {
      this.signer = new TradeHubMnemonicSigner(this.privateKey)
      this.bech32Address = SWTHAddress.privateKeyToAddress(this.privateKey)
    } else {
      throw new Error("cannot instantiate wallet signer")
    }

    this.pubKeyBase64 = SWTHAddress.privateToPublicKey(this.privateKey).toString("base64")
  }

  public updateNetwork(network: Network): TradeHubWallet {
    this.network = network
    this.api = new APIClient(network, {
      debugMode: this.debugMode,
    });

    return this
  }

  public static withPrivateKey(privateKey: string | Buffer, opts: Omit<TradeHubWalletInitOpts, "privateKey"> = {}) {
    return new TradeHubWallet({
      ...opts,
      privateKey,
    })
  }

  public static withMnemonic(mnemonic: string, opts: Omit<TradeHubWalletInitOpts, "mnemonic"> = {}) {
    return new TradeHubWallet({
      ...opts,
      mnemonic,
    })
  }

  public static withSigner(signer: TradeHubSigner, publicKeyBase64: string, opts: Omit<TradeHubWalletInitOpts, "signer"> = {}) {
    return new TradeHubWallet({
      ...opts,
      signer,
      publicKeyBase64,
    })
  }

  public async loadAccount(): Promise<RestResponse.Account> {
    const address = this.bech32Address;
    const response = await this.api.getAccount({ address });
    const account = response.result.value;

    this.account = parseInt(account.account_number);
    this.sequence = parseInt(account.sequence);

    return account;
  }

  public async init(force: boolean = false): Promise<TradeHubWallet> {
    // if account number is already loaded, skip initialization
    // unless force flag is marked as true.
    if (!force && this.account > 0)
      return this;

    // reload account, sets account and sequence numbers
    await this.loadAccount();

    // return self
    return this;
  }

  public async sendTx(msg: TxMsg) {
    const { account, sequence } = this.checkAccountInit();
    const doc = this.genSignDoc([msg]).prepare(account, sequence);
    const signature = this.sign(doc);

    const tx: TradeHubTx = {
      fee: doc.fee,
      memo: doc.memo,
      msg: doc.msgs,
      signatures: [signature],
    };

    const txRequest: TxRequest = {
      mode: "block",
      tx,
    };

    if (this.debugMode) {
      this.log("sendTx", JSON.stringify(txRequest));
    }

    return this.api.tx(txRequest);
  }

  private genSignDoc(msgs: TxMsg[]): PreSignDoc {
    const configs: NetworkConfig = NetworkConfigs[this.network];
    const preSignDoc = new PreSignDoc(configs.ChainId);
    return preSignDoc.appendMsg(...msgs);
  }

  private sign(doc: StdSignDoc): TradeHubSignature {
    const signatureBuffer = this.signer.sign(doc.sortedJson());
    return {
      pub_key: {
        type: 'tendermint/PubKeySecp256k1',
        value: this.pubKeyBase64,
      },
      signature: signatureBuffer.toString("base64"),
    }
  }

  private checkAccountInit(): LoadedAccount {
    if (this.account === undefined || this.sequence === undefined) {
      throw new Error("wallet not initialized, run wallet.init() first.");
    }

    return {
      account: this.account,
      sequence: this.sequence,
    }
  }

  private log(...args: any[]): void {
    if (this.debugMode) {
      console.log.apply(console.log, [this.constructor.name, ...args]);
    }
  }
}

interface LoadedAccount {
  account: number;
  sequence: number;
}
