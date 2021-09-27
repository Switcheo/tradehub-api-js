import fetch from "@lib/utils/fetch";
import BigNumber from "bignumber.js";
import { APIClient } from "../api";
import { Token } from "../models/rest";
import { Blockchain, bnOrZero, CoinGeckoTokenNames, CommonAssetName, Network, OptionalNetworkMap, SimpleMap } from "../utils";

const SYMBOL_OVERRIDE: {
  [symbol: string]: string
} = {
  swth: 'SWTH',
  NNEO: 'nNEO',
  YAM1: 'YAM',
  YAM2: 'YAM',
  ASA1: 'ASA',
  ASA2: 'ASA',
  DBC1: 'DBC',
  DBC2: 'DBC',
}

const BLACK_LIST: OptionalNetworkMap<string[]> = {
  [Network.MainNet]: [
    // duplicated token
    "busd.b.1",
    "btcb.b.1",
    "usdt.b.1",
    "nneo1",

    "yam1", // test token
  
    "swth-b", // binance wrapped token
  ],
}

class TokenClient {
  public readonly tokens: SimpleMap<Token> = {};
  public readonly wrapperMap: SimpleMap<string> = {};
  public readonly poolTokens: SimpleMap<Token> = {};
  public readonly symbols: SimpleMap<string> = {};
  public readonly usdValues: SimpleMap<BigNumber> = {};

  private additionalGeckoDenoms: SimpleMap<string> = {};

  private constructor(
    public readonly api: APIClient,
    public readonly network: Network,
  ) {
  }

  public static instance(api: APIClient, network: Network) {
    return new TokenClient(api, network);
  }

  public async initialize(): Promise<void> {
    await this.reloadWrapperMap();
    await this.reloadTokens();
    await this.reloadUSDValues();
  }

  public registerGeckoIdMap(map: SimpleMap<string>) {
    this.additionalGeckoDenoms = {
      ...this.additionalGeckoDenoms,
      ...map,
    };
  }

  public getCommonDenom(denom: string): string {
    return CommonAssetName[denom] ?? denom;
  }

  public getDecimals(denom: string): number | undefined {
    return (this.tokens[denom] ?? this.poolTokens[denom])?.decimals
  }

  public getBlockchain(denom: string, overrideMap: SimpleMap<Blockchain> = { swth: Blockchain.TradeHub }): Blockchain | undefined {
    if (overrideMap?.[denom]) {
      return overrideMap[denom];
    }

    if (TokenClient.isPoolToken(denom)) return Blockchain.TradeHub;

    return this.tokens[denom]?.blockchain as Blockchain | undefined;
  }

  public getSymbol(denom: string): string {
    const commonDenom = this.getCommonDenom(denom);
    return this.symbols[commonDenom] ?? commonDenom.toUpperCase();
  }

  public getUSDValue(denom: string): BigNumber | undefined {
    const commonDenom = this.getCommonDenom(denom);
    return this.usdValues[commonDenom];
  }

  public getTokenName(denom: string, overrideMap?: SimpleMap): string {
    if (typeof denom !== 'string') return '';
    denom = denom.toLowerCase();

    const symbol = this.getSymbol(denom);
    if (TokenClient.isPoolToken(denom)) {
      const match = symbol.match(/^([a-z\d.-]+)-(\d+)-([a-z\d.-]+)-(\d+)-lp\d+$/i);
      // inconsistent implementation of isPoolToken, exit
      if (match === null) return symbol;

      const denomA = match[1];
      const denomB = match[3];

      const symbolA = this.getTokenName(denomA);
      const symbolB = this.getTokenName(denomB);

      return `${symbolA}-${symbolB}`
    }

    if (SYMBOL_OVERRIDE[symbol]) {
      return SYMBOL_OVERRIDE[symbol]
    }

    if (overrideMap?.[symbol]) {
      return overrideMap[symbol]
    }

    return symbol;
  }

  public getTokenDesc(denom: string) {
    if (typeof denom !== 'string') return '';
    denom = denom.toLowerCase();

    if (TokenClient.isPoolToken(denom)) {
      const match = denom.match(/^([a-z\d.-]+)-(\d+)-([a-z\d.-]+)-(\d+)-lp\d+$/i);
      // inconsistent implementation of isPoolToken, exit
      if (match === null) return this.getSymbol(denom);

      const denomA = match[1];
      const weightA = match[2];
      const denomB = match[3];
      const weightB = match[4];

      const symbolA = this.getTokenName(denomA);
      const symbolB = this.getTokenName(denomB);

      return `${weightA}% ${symbolA} / ${weightB}% ${symbolB}`;
    }

    return this.tokens[denom]?.name ?? this.getSymbol(denom);
  }

  public static isPoolToken(denom: string): boolean {
    return denom.match(/^([a-z\d.-]+)-(\d+)-([a-z\d.-]+)-(\d+)-lp\d+$/i) !== null;
  }

  public isWrappedToken(denom?: string) {
    return !!this.wrapperMap[denom ?? ""];
  }
  public hasWrappedToken(denom?: string) {
    return Object.values(this.wrapperMap).includes(denom);
  }

  public getWrappedTokens(denom: string): Token[] {
    const result: Token[] = [];

    if (!this.tokens) return result;

    // check if denom is source token
    if (Object.values(this.wrapperMap).includes(denom)) {
      for (const [wrappedDenom, sourceDenom] of Object.entries(this.wrapperMap)) {
        // if mapping is not relevant to current source denom, skip.
        if (sourceDenom !== denom) {
          continue;
        }

        // add wrapped to result list
        const token = this.tokens[wrappedDenom];

        if (token)
          result.push(token);
      }
    }

    return result;
  }

  public getWrappedToken(denom: string, blockchain?: Blockchain): Token | null {
    // check if denom is wrapped token
    if (this.wrapperMap[denom])
      return this.tokens[denom];

    // check if denom is source token
    if (Object.values(this.wrapperMap).includes(denom)) {
      for (const [wrappedDenom, sourceDenom] of Object.entries(this.wrapperMap)) {
        // if mapping is not relevant to current source denom, skip.
        if (sourceDenom !== denom) {
          continue;
        }

        // check if wrapped denom is of correct blockchain
        const token = this.tokens[wrappedDenom];
        if (!blockchain || token?.blockchain === blockchain) {
          return token;
        }
      }
    }

    return null;
  }

  public getSourceToken(denom: string): Token | null {
    // check if denom is source token
    if (Object.values(this.wrapperMap).includes(denom))
      return this.tokens[denom];

    // check if denom is wrapped token
    if (this.wrapperMap[denom]) {
      const sourceDenom = this.wrapperMap[denom];
      return this.tokens[sourceDenom];
    }

    return null;
  }

  public async reloadTokens(): Promise<SimpleMap<Token>> {
    const tokenList = await this.api.getTokens();

    for (const token of tokenList) {
      if (BLACK_LIST[this.network]?.includes(token.denom)) continue;

      if (TokenClient.isPoolToken(token.denom)) {
        this.poolTokens[token.denom] = token;
      } else {
        this.tokens[token.denom] = token;

        if (!this.wrapperMap[token.denom]) {
          const commonDenom = CommonAssetName[token.denom] ?? token.denom;
          this.symbols[commonDenom] = token.symbol;
        }
      }
    }

    return this.tokens;
  }

  public async reloadWrapperMap(): Promise<SimpleMap<string>> {
    const mappingResponse = await this.api.getCoinMapping();
    Object.assign(this.wrapperMap, mappingResponse?.result ?? {});
    return this.wrapperMap;
  }

  public async reloadUSDValues(denoms: string[] = Object.keys(this.tokens)): Promise<SimpleMap<BigNumber>> {
    // flatten duplicate denoms
    const commonDenoms = denoms.reduce((accum, denom) => {
      if (TokenClient.isPoolToken(denom))
        return accum;

      const commonDenom = CommonAssetName[denom] ?? denom

      if (!accum[commonDenom])
        accum[commonDenom] = commonDenom;
      return accum;
    }, {} as SimpleMap);
    const coinIds = Object.keys(commonDenoms).map((denom) => CoinGeckoTokenNames[denom] ?? denom);

    const request = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`);
    const response = await request.json();

    for (const denom in commonDenoms) {
      const coinId = CoinGeckoTokenNames[denom]
      const price = bnOrZero(response?.[coinId]?.usd)
      if (price?.gt(0)) {
        this.usdValues[denom] = price!
      }
    }

    return this.usdValues;
  }
}

export default TokenClient;
