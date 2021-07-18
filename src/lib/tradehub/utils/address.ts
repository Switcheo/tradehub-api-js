import * as Base58Check from 'base58check'
import * as bech32 from 'bech32'
import * as BIP32 from 'bip32'
import * as BIP39 from 'bip39'
import bip44Constants from 'bip44-constants'
import { ethers } from 'ethers'
import ripemd160 from 'ripemd160'
import * as secp256k1 from 'secp256k1'
import * as secp256r1 from 'secp256r1'
import { sha256 } from 'sha.js'
import * as wif from 'wif'
import { Network, NetworkConfigs } from "./network"
import { Bech32Type } from './types'

const BIP44_PURPOSE = 44

const {
  NEO_COIN_TYPE,
  ETH_COIN_TYPE,
} = bip44Constants.reduce((result, coin) => {
  switch (coin[1]) {
    case 'NEO':
      result.NEO_COIN_TYPE = coin[0] - 0x80000000
      break
    case 'ETH':
      result.ETH_COIN_TYPE = coin[0] - 0x80000000
      break
  }
  return result
}, {})

const SWTH_COIN_TYPE = 118

/**
 * Convenience function to coalesce a string/buffer into a buffer
 * 
 * @param stringOrBuffer a string or buffer type
 * @param encoding BufferEncoding from Buffer
 * @param force option to return an empty buffer regardless of input
 */
export const stringOrBufferToBuffer = (
  stringOrBuffer?: string | Buffer,
  encoding: BufferEncoding = 'hex',
  force: boolean = false,
): Buffer | null => {
  if (typeof stringOrBuffer === 'string') {
    return Buffer.from(stringOrBuffer, encoding)
  }

  if (stringOrBuffer instanceof Buffer) {
    return stringOrBuffer as Buffer
  }

  // not a string nor buffer
  // e.g. null/undefined
  if (force) {
    return Buffer.alloc(0)
  }

  // if not forcing to return an empty buffer, return null
  return null
}


export class BIP44Path {
  constructor(
    public purpose: number = BIP44_PURPOSE,
    public coinType: number = SWTH_COIN_TYPE,
    public account: number = 0,
    public change: number = 0,
    public index: number = 0,
  ) { }

  static generateBIP44String(
    index: number = 0,
    change: number = 0,
    account: number = 0,
    coinType: number = 0,
    purpose: number = 0,
  ) {
    return `m/${purpose}'/${coinType}'/${account}'/${change}/${index}`
  }

  update(
    index: number = this.index,
    change: number = this.change,
    account: number = this.account,
    coinType: number = this.coinType,
    purpose: number = this.purpose,
  ): BIP44Path {
    this.index = index;
    this.change = change;
    this.account = account;
    this.coinType = coinType;
    this.purpose = purpose;

    return this;
  }

  generate(): string {
    return BIP44Path.generateBIP44String(
      this.index,
      this.change,
      this.account,
      this.coinType,
      this.purpose,
    )
  }
}

export const randomMnemonic = () => {
  return BIP39.generateMnemonic()
}
export const wifEncodePrivateKey = (privateKey: string | Buffer, iter: number = 128) => {
  const privateKeyBuf = stringOrBufferToBuffer(privateKey)
  return wif.encode(iter, privateKeyBuf, true)
}

export interface AddressOptions { }

export interface AddressBuilder<T extends AddressOptions> {

  /**
   * BIP44 coin type
   * used in `m/44'/${coinType}'/0'/0/0`
   */
  coinType(): number

  /**
   * derives address
   * 
   * @param publicKey accepts both encoded/compressed or unencoded/uncompressed public key 
   */
  publicKeyToScriptHash(publicKey: string | Buffer): string
  publicKeyToAddress(publicKey: string | Buffer, opts?: T): string
  generateAddress(mnemonic: string, account?: number, opts?: T): string

  mnemonicToPrivateKey(mnemonic: string, account?: number, opts?: T): Buffer

  privateKeyToAddress(privateKey: string | Buffer, opts?: T): string
  privateToPublicKey(privateKey: string | Buffer): Buffer

  /**
   * Returns a 33-byte encoded/compressed public key, also known as the encoded public key
   * 
   * @param unencodedPublicKey - 65-byte raw/unencoded public key
   */
  encodePublicKey(unencodedPublicKey: string | Buffer): Buffer
}

export interface SWTHAddressOptions extends AddressOptions {
  network?: Network
  type?: Bech32Type
}

type SWTHAddressType = AddressBuilder<SWTHAddressOptions> & {
  newMnemonic(): string
  getBech32Prefix(net?: Network, type?: Bech32Type): string
  addrPrefix: { [index: string]: string }
  getAddressBytes(bech32Address: string, networkConfig?: Network): Uint8Array
}

export const SWTHAddress: SWTHAddressType = {
  newMnemonic: () => {
    return randomMnemonic();
  },

  coinType: (): number => {
    return SWTH_COIN_TYPE
  },

  publicKeyToScriptHash: (publicKey: string | Buffer): string => {
    const sha256Hash = new sha256().update(publicKey).digest()
    const ripemdHash = new ripemd160().update(sha256Hash).digest("hex")

    return ripemdHash
  },

  publicKeyToAddress: (publicKey: string | Buffer, opts?: SWTHAddressOptions): string => {
    const scriptHash = SWTHAddress.publicKeyToScriptHash(publicKey)
    const words = bech32.toWords(Buffer.from(scriptHash, "hex"))
    const addressPrefix = SWTHAddress.getBech32Prefix(opts?.network, opts?.type)
    const addressBech32 = bech32.encode(addressPrefix, words)

    return addressBech32
  },

  encodePublicKey: (): Buffer => {
    throw new Error('SWTH public keys do not compress')
  },

  mnemonicToPrivateKey: (mnemonic: string, account: number = 0): Buffer => {
    const coinType = SWTHAddress.coinType()
    const path = new BIP44Path(BIP44_PURPOSE, coinType).update(account).generate()
    const seed = BIP39.mnemonicToSeedSync(mnemonic)
    const masterKey = BIP32.fromSeed(seed)
    const hardenedDerivation = masterKey.derivePath(path)
    const privateKey = hardenedDerivation.privateKey

    if (!privateKey)
      throw new Error('Private key derivation from mnemonic failed')

    return privateKey
  },

  privateToPublicKey: (privateKey: string | Buffer): Buffer => {
    const privateKeyBuff = stringOrBufferToBuffer(privateKey)
    const publicKeyUint8Array: Uint8Array = secp256k1.publicKeyCreate(privateKeyBuff, true)
    const publicKey = Buffer.from(publicKeyUint8Array)
    return publicKey;
  },

  privateKeyToAddress: (privateKey: string | Buffer, opts?: SWTHAddressOptions): string => {
    const publicKey = SWTHAddress.privateToPublicKey(privateKey)
    const address = SWTHAddress.publicKeyToAddress(publicKey, opts)

    return address
  },

  generateAddress: (mnemonic: string, account: number = 0, opts?: SWTHAddressOptions) => {
    const privateKey = SWTHAddress.mnemonicToPrivateKey(mnemonic, account)
    const address = SWTHAddress.privateKeyToAddress(privateKey, opts)
    return address
  },

  getBech32Prefix(net: Network = Network.MainNet, type: Bech32Type = 'main') {
    const mainPrefix = NetworkConfigs[net].Bech32Prefix
    const addrPrefix = SWTHAddress.addrPrefix
    switch (type) {
      case 'main':
        // e.g. swth
        return mainPrefix
      case 'validator':
        // e.g. swthvaloper
        return mainPrefix + addrPrefix.validator + addrPrefix.operator
      case 'consensus':
        // e.g. swthvalconspub
        return mainPrefix + addrPrefix.validator + addrPrefix.consensus + addrPrefix.public
      default:
        return mainPrefix
    }
  },

  addrPrefix: {
    validator: 'val',
    operator: 'oper',
    consensus: 'cons',
    public: 'pub',
  },

  getAddressBytes: (bech32Address: string, net?: Network): Uint8Array => {
    const { prefix: b32Prefix, words } = bech32.decode(bech32Address)
    if (net) {
      const prefix = SWTHAddress.getBech32Prefix(net, 'main')
      if (b32Prefix !== prefix) {
        throw new Error("Prefix doesn't match")
      }
    }
    return new Uint8Array(bech32.fromWords(words))
  }
}

export const NEOAddress: AddressBuilder<AddressOptions> = {
  coinType: (): number => {
    return NEO_COIN_TYPE
  },

  publicKeyToScriptHash: (publicKey: string | Buffer): string => {
    const encodedPublicKey = NEOAddress.encodePublicKey(publicKey)

    const addressScript = Buffer.concat([
      Buffer.from([0x21]),  // OptCode.PUSHBYTES21
      encodedPublicKey,
      Buffer.from([0xac]),  // OptCode.CHECKSIG
    ])
    const sha256Hash = new sha256().update(addressScript).digest()
    const ripemdHash = new ripemd160().update(sha256Hash).digest('hex')

    return ripemdHash
  },

  publicKeyToAddress: (publicKey: string | Buffer): string => {
    const addressScript = NEOAddress.publicKeyToScriptHash(publicKey)
    const address = Base58Check.encode(addressScript, '17')

    return address
  },

  encodePublicKey: (unencodedPublicKey: string | Buffer): Buffer => {
    const unencPubKeyBuf = stringOrBufferToBuffer(unencodedPublicKey)
    if (unencPubKeyBuf.length <= 33) {
      // length indicates already encoded
      return unencPubKeyBuf
    }

    const pointXHex = unencPubKeyBuf.slice(1, 33)
    const pointYEven = unencPubKeyBuf[unencPubKeyBuf.length - 1] % 2 === 0
    const compressedPublicKey = Buffer.concat([
      Buffer.from([pointYEven ? 0x02 : 0x03]),
      pointXHex,
    ])
    return compressedPublicKey
  },

  mnemonicToPrivateKey: (mnemonic: string, account: number = 0): Buffer => {
    const coinType = NEOAddress.coinType()
    const path = new BIP44Path(BIP44_PURPOSE, coinType).update(account).generate()
    const seed = BIP39.mnemonicToSeedSync(mnemonic)
    const masterKey = BIP32.fromSeed(seed)
    const hardenedDerivation = masterKey.derivePath(path)
    const privateKey = hardenedDerivation.privateKey

    if (!privateKey)
      throw new Error('Private key derivation from mnemonic failed')

    return privateKey
  },

  privateToPublicKey: (privateKey: string | Buffer): Buffer => {
    const privateKeyBuff = stringOrBufferToBuffer(privateKey)
    const publicKeyUint8Array: Uint8Array = secp256r1.publicKeyCreate(privateKeyBuff, true)
    return Buffer.from(publicKeyUint8Array)
  },

  privateKeyToAddress: (privateKey: string | Buffer): string => {
    const compressedPublicKey = NEOAddress.privateToPublicKey(privateKey)
    const address = NEOAddress.publicKeyToAddress(compressedPublicKey)

    return address
  },

  generateAddress: (mnemonic: string, account: number = 0) => {
    const privateKey = NEOAddress.mnemonicToPrivateKey(mnemonic, account)
    return NEOAddress.privateKeyToAddress(privateKey)
  },
}


export const ETHAddress: AddressBuilder<AddressOptions> = {
  coinType: (): number => {
    return ETH_COIN_TYPE
  },

  publicKeyToScriptHash: (publicKey: string | Buffer): string => {
    const encodedPublicKey = ETHAddress.encodePublicKey(publicKey)
    return ethers.utils.keccak256(encodedPublicKey)
  },

  publicKeyToAddress: (publicKey: string | Buffer): string => {
    const publicKeyBuff = stringOrBufferToBuffer(publicKey)
    return ethers.utils.computeAddress(publicKeyBuff)
  },

  encodePublicKey: (unencodedPublicKey: string | Buffer): Buffer => {
    const unencodedPublicKeyBuff = stringOrBufferToBuffer(unencodedPublicKey)
    const publicKey = ethers.utils.computePublicKey(unencodedPublicKeyBuff, true)
    return Buffer.from(publicKey, 'hex')
  },

  mnemonicToPrivateKey: (mnemonic: string, account: number = 0): Buffer => {
    const coinType = ETHAddress.coinType()
    const path = new BIP44Path(BIP44_PURPOSE, coinType).update(account).generate()
    const seed = BIP39.mnemonicToSeedSync(mnemonic)
    const masterKey = BIP32.fromSeed(seed)
    const hardenedDerivation = masterKey.derivePath(path)
    const privateKey = hardenedDerivation.privateKey

    if (!privateKey)
      throw new Error('Private key derivation from mnemonic failed')

    return privateKey
  },

  privateToPublicKey: (privateKey: string | Buffer): Buffer => {
    const privateKeyBuff = stringOrBufferToBuffer(privateKey)
    const publicKeyUint8Array: Uint8Array = secp256r1.publicKeyCreate(privateKeyBuff, true)
    return Buffer.from(publicKeyUint8Array)
  },

  privateKeyToAddress: (privateKey: string | Buffer): string => {
    const compressedPublicKey = ETHAddress.privateToPublicKey(privateKey);
    const address = ETHAddress.publicKeyToAddress(compressedPublicKey)
    return address
  },

  generateAddress: (mnemonic: string, account: number = 0) => {
    const privateKey = ETHAddress.mnemonicToPrivateKey(mnemonic, account)
    return ETHAddress.privateKeyToAddress(privateKey)
  },
}
