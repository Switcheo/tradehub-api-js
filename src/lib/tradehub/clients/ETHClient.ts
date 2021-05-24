import { ABIs } from "@lib/eth";
import { TokenInitInfo } from "@lib/types";
import { ethers } from "ethers";
import { Blockchain, EthNetworkConfig, Network, NetworkConfigs } from "../utils";

export interface ETHClientOpts {
  network: Network,
  blockchain: Blockchain,
}

export class ETHClient {
  static SUPPORTED_BLOCKCHAINS = [Blockchain.BinanceSmartChain, Blockchain.Ethereum]
  static BLOCKCHAIN_KEY = {
    [Blockchain.BinanceSmartChain]: "Bsc",
    [Blockchain.Ethereum]: "Eth",
  }

  private constructor(
    public readonly network: Network,
    public readonly blockchain: Blockchain,
  ) { }

  public static instance(opts: ETHClientOpts) {
    const { network, blockchain } = opts

    if (!ETHClient.SUPPORTED_BLOCKCHAINS.includes(blockchain))
      throw new Error(`unsupported blockchain - ${blockchain}`)

    return new ETHClient(network, blockchain)
  }

  public async retrieveERC20Info(address: string): Promise<TokenInitInfo> {
    const provider = this.getProvider()
    const contract = new ethers.Contract(address, ABIs.erc20, provider)
    const decimals = await contract.decimals()
    const name = await contract.name()
    const symbol = await contract.symbol()

    return { address, decimals, name, symbol }
  }

  public getProvider() {
    return new ethers.providers.JsonRpcProvider(this.getProviderUrl())
  }

  public getConfig(): EthNetworkConfig {
    return NetworkConfigs[this.network][ETHClient.BLOCKCHAIN_KEY[this.blockchain]];
  }

  public getPayerUrl() {
    return this.getConfig().PayerURL;
  }

  public getProviderUrl() {
    return this.getConfig().RpcURL;
  }

  public getLockProxyAddress() {
    return this.getConfig().LockProxyAddr;
  }

  public getBalanceReaderAddress() {
    return this.getConfig().BalanceReader;
  }

  public getWalletBytecodeHash() {
    return this.getConfig().ByteCodeHash;
  }
}
