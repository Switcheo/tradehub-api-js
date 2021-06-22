import { NETWORK } from "@lib/config";
import { Blockchain } from "@lib/constants";
import { Network, TokenInitInfo } from "@lib/types";
import { logger } from "@lib/utils";
import Neon, { rpc, api } from '@cityofzion/neon-js'
import {
  wallet as neonWallet,
} from '@cityofzion/neon-core'

export interface NEOClientOpts {
  network: Network,
  blockchain?: Blockchain,
}
/**
 * @deprecated 
 * use TradeHubSDK.neo
 */
export class NEOClient {
  static SUPPORTED_BLOCKCHAINS = [Blockchain.Neo]

  private constructor(
    public readonly network: Network,
    public readonly blockchain: Blockchain,
  ) { }

  public static instance(opts: NEOClientOpts) {
    const {
      network,
      blockchain = Blockchain.Neo,
    } = opts

    if (!NEOClient.SUPPORTED_BLOCKCHAINS.includes(blockchain))
      throw new Error(`unsupported blockchain - ${blockchain}`)

    return new NEOClient(network, blockchain)
  }

  public async retrieveNEP5Info(scriptHash: string): Promise<TokenInitInfo> {
    const url = this.getProviderUrl()
    const sb = Neon.create.scriptBuilder()
    sb.emitAppCall(scriptHash, "symbol", [])
    sb.emitAppCall(scriptHash, "name", [])
    sb.emitAppCall(scriptHash, "decimals", [])

    const response = await rpc.Query.invokeScript(sb.str).execute(url)
    logger("retrieveNEP5Info", response)

    if (response?.result?.state !== 'HALT')
      throw new Error("retrieve failed")

    const symbol = Neon.u.hexstring2str(response.result.stack?.[0].value)
    const name = Neon.u.hexstring2str(response.result.stack?.[1].value)
    const decimals = parseInt(response.result.stack?.[2].value ?? '0', 10)

    return { address: scriptHash, decimals, name, symbol }
  }

  public getProviderUrl() {
    return NETWORK[this.network].NEO_URLS[0];
  }

  public async wrapNeoToNneo(neoAmount: number, account, rpcUrl) {
    const wrapperContractScriptHash = 'f46719e2d16bf50cddcef9d4bbfece901f73cbb6'
    const wrapperContractAddress = neonWallet.getAddressFromScriptHash(wrapperContractScriptHash)

    // Build config
    const intent = api.makeIntent({ NEO: neoAmount }, wrapperContractAddress);
    console.log('intent', intent)
    const props = {
      scriptHash: wrapperContractScriptHash,
      operation: "mintTokens",
      args: []
    }

    const script = Neon.create.script(props)
    const apiProvider = new api.neoscan.instance("MainNet")

    const config = {
      api: apiProvider, // Network
      url: rpcUrl,
      account, // Sender's Account
      intents: intent,
      script: script
    }

    // Neon API
    return Neon.doInvoke(config)
      .then(res => {
        console.log("\n\n--- Response ---")
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
