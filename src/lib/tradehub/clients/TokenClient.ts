import fetch from "@lib/utils/fetch";
import BigNumber from "bignumber.js";
import { APIClient } from "../api";
import { Token } from "../models/rest";
import { bnOrZero, CoinGeckoTokenNames, CommonAssetName, SimpleMap } from "../utils";


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

  public static isPoolToken(denom: string) {
    return denom.match(/-lp\d+$/i) !== null;
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
