import * as bip39 from 'bip39'
import hdkey from 'hdkey'
import bip44Constants from 'bip44-constants'
import wif from 'wif'

import { Blockchain } from '../constants'

type WalletResult = Record<
  Blockchain.Neo | Blockchain.Ethereum | 'mnemonic',
  string
>

const enum PrivateKeyFormat {
  'wif' = 'wif',
  'hex' = 'hex',
}

export class HDWallet {
  public static newWallet(): WalletResult {
    const mnemonic: string = bip39.generateMnemonic()

    const seed: any = bip39.mnemonicToSeed(mnemonic)
    const root: hdkey = hdkey.fromMasterSeed(seed)

    return this.getWalletResult(root, mnemonic)
  }

  public static getWallet(mnemonic: string, skipValidate?: boolean): WalletResult {
    if (!skipValidate && !bip39.validateMnemonic(mnemonic)) {
      throw new Error('bad mnemonic from mnemonic by validateMnemonic')
    }
    const seed: any = bip39.mnemonicToSeedSync(mnemonic, '')
    const root: hdkey = hdkey.fromMasterSeed(seed)

    return this.getWalletResult(root, mnemonic)
  }

  private static getKey = (root: hdkey, coinType: number, format: PrivateKeyFormat): string => {
    // m/purpose'/coin_type'/account'/change/address_index
    const addrNode: any = root.derive(`m/44'/${coinType}'/0'/0/0`)

    switch (format) {
      case 'wif':
        return wif.encode(128, addrNode._privateKey, true)
      case 'hex':
        return addrNode._privateKey.toString('hex')
      default:
        throw new Error('unknown getKey format')
    }
  }

  private static getWalletResult(root: hdkey, mnemonic: string): WalletResult {
    return {
      [Blockchain.Ethereum]: this.getKey(
        root, this.getCoinType(Blockchain.Ethereum), PrivateKeyFormat.hex),
      [Blockchain.Neo]: this.getKey(
        root, this.getCoinType(Blockchain.Neo), PrivateKeyFormat.wif),
      mnemonic,
    }
  }

  private static getCoinType(blockchain: Blockchain): number {
    const coins = bip44Constants.filter(item => item[1] === blockchain.toUpperCase())
    if (coins.length != 1) {
      throw new Error('Could not find maching bip44 constant')
    }
    const id = coins[0][0]
    return id - 0x80000000
  }
}
