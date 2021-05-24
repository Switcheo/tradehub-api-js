import Neon, { rpc } from "@cityofzion/neon-js";
import { TokenInitInfo } from "@lib/types";
import { logger } from "@lib/utils";
import { Blockchain, NeoNetworkConfig, Network, NetworkConfigs } from "../utils";

export interface NEOClientOpts {
  network: Network,
  blockchain?: Blockchain,
}

export class NEOClient {
  static SUPPORTED_BLOCKCHAINS = [Blockchain.Neo]
  static BLOCKCHAIN_KEY = {
    [Blockchain.Neo]: "Neo",
  }

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

    if (response?.result?.state !== "HALT")
      throw new Error("retrieve failed")

    const symbol = Neon.u.hexstring2str(response.result.stack?.[0].value)
    const name = Neon.u.hexstring2str(response.result.stack?.[1].value)
    const decimals = parseInt(response.result.stack?.[2].value ?? "0", 10)

    return { address: scriptHash, decimals, name, symbol }
  }

  public getConfig(): NeoNetworkConfig {
    return NetworkConfigs[this.network][NEOClient.BLOCKCHAIN_KEY[this.blockchain]];
  }

  public getProviderUrl() {
    return this.getConfig().RpcURL;
  }
}
