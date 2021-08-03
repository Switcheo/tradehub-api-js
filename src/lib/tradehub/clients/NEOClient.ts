import {
  rpc as neonRPC,
  sc as neonScript,
  u as neonUtils, wallet as neonWallet
} from '@cityofzion/neon-core';
import Neon, { api, rpc } from '@cityofzion/neon-js';
import { TokenInitInfo } from "@lib/types";
import { logger } from "@lib/utils";
import BigNumber from "bignumber.js";
import { chunk } from 'lodash';
import { APIClient } from "../api";
import { RestModels } from "../models";
import { Blockchain, NeoNetworkConfig, NetworkConfigProvider } from "../utils";

export interface NEOClientOpts {
  configProvider: NetworkConfigProvider,
  blockchain?: Blockchain,
}

interface ScriptResult {
  stack: ReadonlyArray<{ type: string, value: string }>
}

export class NEOClient {
  static SUPPORTED_BLOCKCHAINS = [Blockchain.Neo]
  static BLOCKCHAIN_KEY = {
    [Blockchain.Neo]: "Neo",
  }

  private constructor(
    public readonly configProvider: NetworkConfigProvider,
    public readonly blockchain: Blockchain,
  ) { }

  public static instance(opts: NEOClientOpts) {
    const {
      configProvider,
      blockchain = Blockchain.Neo,
    } = opts

    if (!NEOClient.SUPPORTED_BLOCKCHAINS.includes(blockchain))
      throw new Error(`unsupported blockchain - ${blockchain}`)

    return new NEOClient(configProvider, blockchain)
  }

  private parseHexNum(hex: string, exp: number = 0): string {
    if (!hex || typeof (hex) !== 'string') return '0'
    const res: string = hex.length % 2 !== 0 ? `0${hex}` : hex
    return new BigNumber(res ? neonUtils.reverseHex(res) : '00', 16).shiftedBy(-exp).toString()
  }

  public async getExternalBalances(api: APIClient, address: string, url: string, whitelistDenoms?: string[]) {
    const tokenList = await api.getTokens()
    const account = new neonWallet.Account(address)
    const tokens = tokenList.filter(token =>
      token.blockchain == this.blockchain &&
      token.asset_id.length == 40 &&
      token.lock_proxy_hash.length == 40
    )

    const client: neonRPC.RPCClient =
      new neonRPC.RPCClient(url, '2.5.2') // TODO: should we change the RPC version??

    // NOTE: fetching of tokens is chunked in sets of 15 as we may hit
    // the gas limit on the RPC node and error out otherwise
    const promises: Promise<{}>[] = // tslint:disable-line
      chunk(tokens, 75).map(async (partition: ReadonlyArray<RestModels.TokenObject>) => {

        let acc = {}
        for (const token of partition) {
          if (whitelistDenoms && !whitelistDenoms.includes(token.denom)) continue
          const sb: neonScript.ScriptBuilder = new neonScript.ScriptBuilder()
          sb.emitAppCall(Neon.u.reverseHex(token.asset_id),
            'balanceOf', [neonUtils.reverseHex(account.scriptHash)])

          try {
            const response: ScriptResult = await client.invokeScript(sb.str) as ScriptResult
            acc[token.denom.toUpperCase()] = response.stack[0].type === 'Integer' // Happens on polychain devnet
              ? response.stack[0].value
              : this.parseHexNum(response.stack[0].value)

          } catch (err) {
            console.error('Could not retrieve external balance for ', token.denom)
            console.error(err)
          }

        }

        return acc
      })

    const result = await Promise.all(promises).then((results: any[]) => {
      return results.reduce((acc: {}, res: {}) => ({ ...acc, ...res }), {})
    })

    for (let i = 0; i < tokens.length; i++) {
      (tokens[i] as any).external_balance = result[(tokens[i] as any).denom.toUpperCase()]
    }
    return tokens
  }

  public async retrieveNEP5Info(scriptHash: string): Promise<TokenInitInfo> {
    const url = this.getProviderUrl()
    const sb = Neon.create.scriptBuilder()
    sb.emitAppCall(scriptHash, "symbol", [])
    sb.emitAppCall(scriptHash, "name", [])
    sb.emitAppCall(scriptHash, "decimals", [])

    const response = await rpc.Query.invokeScript(sb.str).execute(url)
    logger("retrieveNEP5Info", response)

    if (response?.result?.state !== "HALT")
      throw new Error("retrieve failed")

    const symbol = Neon.u.hexstring2str(response.result.stack?.[0].value)
    const name = Neon.u.hexstring2str(response.result.stack?.[1].value)
    const decimals = parseInt(response.result.stack?.[2].value ?? "0", 10)

    return { address: scriptHash, decimals, name, symbol }
  }

  public async wrapNeoToNneo(neoAmount: BigNumber, account, rpcUrl) {
    const wrapperContractScriptHash = this.getConfig().WrapperScriptHash;
    const wrapperContractAddress = neonWallet.getAddressFromScriptHash(wrapperContractScriptHash);

    // Build config
    const intent = api.makeIntent({ NEO: neoAmount.toNumber() }, wrapperContractAddress);
    logger('intent', intent);

    const props = {
      scriptHash: wrapperContractScriptHash,
      operation: "mintTokens",
      args: []
    };

    const script = Neon.create.script(props);
    const apiProvider = new api.neoscan.instance("MainNet");

    const config = {
      api: apiProvider, // Network
      url: rpcUrl,
      account, // Sender's Account
      intents: intent,
      script: script
    };

    // Neon API
    const response = await Neon.doInvoke(config);
    logger("neo wrapper response", response);
  }

  public async formatWithdrawalAddress(address: string): Promise<string> {
    const isValidAddress = neonWallet.isAddress(address)
    if (!isValidAddress) {
      throw new Error("invalid address")
    }
    const scriptHash = neonWallet.getScriptHashFromAddress(address)
    // return the little endian version of the address
    return neonUtils.reverseHex(scriptHash)
  }

  public getConfig(): NeoNetworkConfig {
    const networkConfig = this.configProvider.getConfig();
    return networkConfig[NEOClient.BLOCKCHAIN_KEY[this.blockchain]];
  }

  public getProviderUrl() {
    return this.getConfig().RpcURL;
  }
}
