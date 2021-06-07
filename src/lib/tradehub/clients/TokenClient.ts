import fetch from "@lib/utils/fetch";
import BigNumber from "bignumber.js";
import { APIClient } from "../api";
import { Token } from "../models/rest";
import { bnOrZero, CoinGeckoTokenNames, CommonAssetName, SimpleMap } from "../utils";

const SYMBOL_OVERRIDE: {
  [symbol: string]: string
} = {
  NNEO: "nNEO",
}

class TokenClient {
  public readonly tokens: SimpleMap<Token> = {};
  public readonly poolTokens: SimpleMap<Token> = {};
  public readonly symbols: SimpleMap<string> = {};
  public readonly usdValues: SimpleMap<BigNumber> = {};

  private constructor(
    public readonly api: APIClient,
  ) {
  }

  public static instance(api: APIClient) {
    return new TokenClient(api);
  }

  public async initialize(): Promise<void> {
    await this.reloadTokens();
    await this.reloadUSDValues();
  }

  public getCommonDenom(denom: string): string {
    return CommonAssetName[denom] ?? denom;
  }
  public getDecimals(denom: string): number | undefined {
    return (this.tokens[denom] ?? this.poolTokens[denom])?.decimals
  }
  public getSymbol(denom: string): string {
    const commonDenom = this.getCommonDenom(denom);
    return this.symbols[commonDenom] ?? commonDenom.toUpperCase();
  }
  public getUSDValue(denom: string): BigNumber | undefined {
    const commonDenom = this.getCommonDenom(denom);
    return this.usdValues[commonDenom];
  }

  public getTokenName(denom: string): string {
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

  public async reloadTokens(): Promise<SimpleMap<Token>> {
    const tokenList = await this.api.getTokens();
    for (const token of tokenList) {
      if (TokenClient.isPoolToken(token.denom)) {
        this.poolTokens[token.denom] = token;
      } else {
        this.tokens[token.denom] = token;

        const commonDenom = CommonAssetName[token.denom] ?? token.denom;
        this.symbols[commonDenom] = token.symbol;
      }
    }

    return this.tokens;
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
