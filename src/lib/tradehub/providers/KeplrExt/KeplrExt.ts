import { AppCurrency, ChainInfo } from "@keplr-wallet/types";
import { DEFAULT_GAS_PRICE, Network, NetworkConfigProvider } from "@lib/tradehub/utils";
import { SWTHAddress } from "@lib/utils";

const SWTH = {
  coinDenom: "SWTH",
  coinMinimalDenom: "swth",
  coinDecimals: 8,
  coinGeckoId: "switcheo",
}

export class KeplrAccount {
  static SWTH_CURRENCY: AppCurrency = SWTH
  static BASE_CHAIN_INFO = {
    bip44: { coinType: SWTHAddress.coinType() },
    currencies: [],
    feeCurrencies: [SWTH],
    gasPriceStep: {
      low: DEFAULT_GAS_PRICE.toNumber(),
      average: DEFAULT_GAS_PRICE.toNumber(),
      high: DEFAULT_GAS_PRICE.toNumber(),
    },
  } as const

  static getChainInfo(configProvider: NetworkConfigProvider): ChainInfo {
    const config = configProvider.getConfig();
    const bech32Prefix = config.Bech32Prefix;
    return {
      feeCurrencies: [KeplrAccount.SWTH_CURRENCY],
      gasPriceStep: KeplrAccount.BASE_CHAIN_INFO.gasPriceStep,
      bip44: KeplrAccount.BASE_CHAIN_INFO.bip44,
      currencies: [KeplrAccount.SWTH_CURRENCY],
      stakeCurrency: KeplrAccount.SWTH_CURRENCY,
      rest: config.RestURL,
      rpc: config.RestURL,
      chainName: config.Network === Network.MainNet ? `Switcheo TradeHub` : `Switcheo TradeHub (${config.Network})`,
      chainId: config.ChainId,
      bech32Config: {
        bech32PrefixAccAddr: `${bech32Prefix}`,
        bech32PrefixAccPub: `${bech32Prefix}pub`,
        bech32PrefixValAddr: `${bech32Prefix}valoper`,
        bech32PrefixValPub: `${bech32Prefix}valoperpub`,
        bech32PrefixConsAddr: `${bech32Prefix}valcons`,
        bech32PrefixConsPub: `${bech32Prefix}valconspub`,
      },
    }
  }
}

export namespace KeplrAccount {

}
