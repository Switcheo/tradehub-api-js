import { Network } from "@lib/types";
import { stringOrBufferToBuffer, SWTHAddress } from "@lib/utils";
import { ethers } from "ethers";
import secp256k1 from 'secp256k1';
import { sha256 } from 'sha.js';
import { APIClient } from "../api";
import { RestModels } from "../models";
import { BroadcastTx, CosmosLedger, NetworkConfig, NetworkConfigs, PreSignDoc, StdSignDoc, TradeHubSignature, TradeHubTx, TxMsg, TxRequest, TxResponse } from "../utils";
import { TradeHubSigner } from "./TradeHubSigner";

export type OnRequestSignCallback = (signDoc: StdSignDoc) => void | Promise<void>
export type OnSignCompleteCallback = (signatureBase64: string) => void | Promise<void>

export interface TradeHubWalletGenericOpts {
  debugMode?: boolean
  network?: Network

  config?: Partial<NetworkConfig>

  /**
   * Optional callback that will be called before signing is requested/executed.
   */
  onRequestSign?: OnRequestSignCallback

  /**
   * Optional callback that will be called when signing is complete.
   */
  onSignComplete?: OnSignCompleteCallback
}

export type TradeHubWalletInitOpts = TradeHubWalletGenericOpts & ({
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

class TradeHubPrivateKeySigner implements TradeHubSigner {
  type = TradeHubSigner.Type.PrivateKey

  async sign(doc: StdSignDoc): Promise<Buffer> {
    const message = doc.sortedJson()
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

class TradeHubLedgerSigner implements TradeHubSigner {
  type = TradeHubSigner.Type.Ledger

  async sign(doc: StdSignDoc): Promise<Buffer> {
    const message = doc.sortedJson()
    const signBytes = await this.ledger.sign(message);
    return Buffer.from(signBytes.buffer);
  }

  constructor(
    readonly ledger: CosmosLedger
  ) { }
}

export class TradeHubWallet {
  network: Network
  debugMode: boolean
  api: APIClient

  configOverride: Partial<NetworkConfig>
  networkConfig: NetworkConfig

  mnemonic?: string
  privateKey?: Buffer
  signer: TradeHubSigner
  bech32Address: string

  ledger?: CosmosLedger
  onRequestSign?: OnRequestSignCallback
  onSignComplete?: OnSignCompleteCallback

  // required for signature generation
  pubKeyBase64: string

  account?: number
  sequence?: number

  txBroadcastQueue: TxRequest[] = []

  // for analytics
  providerAgent?: string

  constructor(opts: TradeHubWalletInitOpts) {
    this.debugMode = opts.debugMode ?? false

    this.configOverride = opts.config ?? {};
    this.updateNetwork(opts.network ?? Network.MainNet);

    this.onRequestSign = opts.onRequestSign;
    this.onSignComplete = opts.onSignComplete;

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
      this.signer = new TradeHubPrivateKeySigner(this.privateKey);
      this.pubKeyBase64 = SWTHAddress.privateToPublicKey(this.privateKey).toString("base64");
    } else {
      throw new Error("cannot instantiate wallet signer")
    }

    this.bech32Address = SWTHAddress.publicKeyToAddress(Buffer.from(this.pubKeyBase64, "base64"), {
      network: this.network,
    });
  }

  public updateNetwork(network: Network): TradeHubWallet {
    this.network = network
    this.networkConfig = {
      ...NetworkConfigs[network],
      ...this.configOverride,
    };

    this.api = new APIClient(this.networkConfig.RestURL, {
      debugMode: this.debugMode,
    });

    return this
  }

  public static withPrivateKey(
    privateKey: string | Buffer,
    opts: Omit<TradeHubWalletInitOpts, "privateKey"> = {}
  ) {
    return new TradeHubWallet({
      ...opts,
      privateKey,
    })
  }

  public static withMnemonic(
    mnemonic: string,
    opts: Omit<TradeHubWalletInitOpts, "mnemonic"> = {}
  ) {
    return new TradeHubWallet({
      ...opts,
      mnemonic,
    })
  }

  public static withSigner(
    signer: TradeHubSigner,
    publicKeyBase64: string,
    opts: Omit<TradeHubWalletInitOpts, "signer"> = {}
  ) {
    return new TradeHubWallet({
      ...opts,
      signer,
      publicKeyBase64,
    })
  }

  public static withLedger(
    cosmosLedger: CosmosLedger,
    publicKeyBase64: string,
    opts: Omit<TradeHubWalletInitOpts, "signer"> = {}
  ) {
    const signer = new TradeHubLedgerSigner(cosmosLedger);
    return TradeHubWallet.withSigner(signer, publicKeyBase64, opts);
  }

  public async loadAccount(): Promise<RestModels.Account> {
    const address = this.bech32Address;
    const response = await this.api.getAccount({ address });
    const account = response.result.value;

    this.account = parseInt(account.account_number);
    this.sequence = parseInt(account.sequence);

    return account;
  }

  public async init(force: boolean = false): Promise<TradeHubWallet> {
    // if account is already loaded, skip initialization
    // unless force flag is marked as true.
    if (!force && this.sequence !== undefined)
      return this;

    // reload account, sets account and sequence numbers
    await this.loadAccount();

    // return self
    return this;
  }

  public async teardown() {
    // no action required yet.
  }

  public async sendTxs(msgs: TxMsg[], memo?: string): Promise<TxResponse> {
    const { account, sequence } = this.checkAccountInit();
    this.log("sendTx", account, sequence);

    const doc = this.genSignDoc(msgs, memo).prepare(account, sequence);
    const signature = await this.sign(doc);

    const tx: TradeHubTx = {
      fee: doc.fee,
      memo: doc.memo,
      msg: doc.msgs,
      signatures: [signature],
    };

    const broadcastTx: BroadcastTx = {
      mode: "block",
      tx,
    };

    this.log("sendTx", JSON.stringify(broadcastTx));

    const response = (await this.api.tx(broadcastTx)) as TxResponse;
    if (response.code || response.error) {
      // tx failed
      console.error(response);
      if (response.error)
        throw new Error(response.error);
      else
        throw new Error(`[${response.code}] ${response.raw_log}`);
    } else {
      // tx successful
      this.sequence++;
    }

    return response;
  }

  public async sendTx(msg: TxMsg, memo?: string): Promise<TxResponse> {
    return this.sendTxs([msg], memo);
  }

  public isSigner(signerType: TradeHubSigner.Type) {
    return this.signer.type === signerType;
  }

  public isLedgerSigner() {
    return this.isSigner(TradeHubSigner.Type.Ledger);
  }

  public isPrivateKeySigner() {
    return this.isSigner(TradeHubSigner.Type.PrivateKey);
  }

  public static verifySignature(signatureBase64: string, plaintext: string, pubKeyBase64: string) {
    // obtain actual signed message
    const hex = ethers.utils.sha256(Buffer.from(plaintext)).substring(2); // remove 0x prefix
    const message = Buffer.from(hex, "hex");

    // get public key buffer
    const publicKey = Buffer.from(pubKeyBase64, "base64");

    const signatureBuffer = Buffer.from(signatureBase64, "base64");

    // verify signature
    return secp256k1.ecdsaVerify(signatureBuffer, message, publicKey);
  }

  private genSignDoc(msgs: TxMsg[], memo?: string): PreSignDoc {
    const configs: NetworkConfig = NetworkConfigs[this.network];
    const preSignDoc = new PreSignDoc(configs.ChainId, memo);
    return preSignDoc.appendMsg(...msgs);
  }

  private async sign(doc: StdSignDoc): Promise<TradeHubSignature> {
    try {
      await this.onRequestSign?.(doc)
    } catch (error) {
      console.error("sign callback error")
      console.error(error)
    }

    let signature: string
    try {
      const signatureBuffer = await this.signer.sign(doc);
      signature = signatureBuffer.toString('base64')
      return {
        pub_key: {
          type: 'tendermint/PubKeySecp256k1',
          value: this.pubKeyBase64,
        },
        signature,
      }
    } finally {
      try {
        await this.onSignComplete?.(signature?.toString())
      } catch (error) {
        console.error("sign callback error")
        console.error(error)
      }
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
