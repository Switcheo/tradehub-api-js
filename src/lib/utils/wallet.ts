// tslint:disable:max-classes-per-file
import bech32 from 'bech32'
import ripemd160 from 'ripemd160'
import secp256k1 from 'secp256k1'
import { sha256 } from 'sha.js'

export class PrivKeySecp256k1 {
  public readonly privKey: Buffer
  constructor(privKey) {
    this.privKey = privKey
  }

  public toBytes(): Uint8Array {
    // return marshalBinaryBare(this) // stub marshalBinaryBare with Uint8Array
    return new Uint8Array(this.privKey)
  }

  public toPubKey() {
    const pubKey = secp256k1.publicKeyCreate(
      Buffer.from(this.privKey),
      true
    );
    return new PubKeySecp256k1(Buffer.from(pubKey));
  }

  public equals(privKey) {
    return this.toBytes().toString() === privKey.toBytes().toString()
  }

  public sign(msg) {
    return secp256k1.ecdsaSign(
      Buffer.from(new sha256().update(msg).digest()),
      Buffer.from(this.privKey)
    )
  }
}

export class PubKeySecp256k1 {
  public readonly pubKey: Buffer
  constructor(pubKey) {
    this.pubKey = pubKey;
  }

  public toBytes() {
    // return marshalBinaryBare(this)
    return new Uint8Array(this.pubKey)
  }

  public toAddress() {
    let hash = new sha256().update(this.pubKey).digest('latin1')
    hash = new ripemd160().update(hash, 'latin1').digest('hex')

    return new Address(Buffer.from(hash, 'hex'))
  }

  public equals(pubKey) {
    return this.toBytes().toString() === pubKey.toBytes().toString()
  }

  public verify(msg, sig) {
    return secp256k1.ecdsaVerify(
      Buffer.from(msg),
      Buffer.from(sig),
      Buffer.from(this.pubKey),
    )
  }
}

export class Address {
  public readonly address: Buffer
  constructor(address) {
    this.address = address
  }

  public static fromBech32(prefix, bech32Addr) {
    const { prefix: b32Prefix, words } = bech32.decode(bech32Addr)
    if (b32Prefix !== prefix) {
      throw new Error("Prefix doesn't match")
    }
    return new Address(bech32.fromWords(words))
  }

  public toBech32(prefix) {
    const words = bech32.toWords(Buffer.from(this.address))
    return bech32.encode(prefix, words)
  }

  public toBytes() {
    return new Uint8Array(this.address)
  }
}

export class BIP44 {
  public readonly purpose: number
  public readonly coinType: number
  public readonly account: number
  constructor(purpose = 44, coinType = 118, account = 0) {
    this.purpose = purpose
    this.coinType = coinType
    this.account = account
  }

  public path(index, change = 0) {
    if (this.purpose !== parseInt(this.purpose.toString(), 10)) {
      throw new Error('Purpose should be integer')
    }
    if (this.coinType !== parseInt(this.coinType.toString(), 10)) {
      throw new Error('CoinType should be integer')
    }
    if (this.account !== parseInt(this.account.toString(), 10)) {
      throw new Error('Account should be integer')
    }
    if (change !== parseInt(change.toString(), 10)) {
      throw new Error('Change should be integer')
    }
    if (index !== parseInt(index.toString(), 10)) {
      throw new Error('Index should be integer')
    }

    return [this.purpose, this.coinType, this.account, change, index];
  }

  public pathString(index, change = 0) {
    const path = this.path(index, change)
    return `m/${path[0]}'/${path[1]}'/${path[2]}'/${path[3]}/${path[4]}`
  }
}

export function getPathArray() {
  return new BIP44().path(0, 0)
}

export function getPath() {
  return new BIP44().pathString(0, 0)
}

