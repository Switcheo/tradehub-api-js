import { ABIs } from "@lib/eth";
import { TokenInitInfo } from "@lib/types";
import { ethers } from "ethers";
import { Blockchain, Network, NetworkConfigs } from "../utils";

export interface ETHOpts {
  network: Network,
  blockchain: Blockchain,
}

export class ETH {
  static SUPPORTED_BLOCKCHAINS = [Blockchain.BinanceSmartChain, Blockchain.Ethereum]

  private constructor(
    public readonly network: Network,
    public readonly blockchain: Blockchain,
  ) { }

  public static instance(opts: ETHOpts) {
    const { network, blockchain } = opts

    if (!ETH.SUPPORTED_BLOCKCHAINS.includes(blockchain))
      throw new Error(`unsupported blockchain - ${blockchain}`)

    return new ETH(network, blockchain)
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

  public getPayerUrl() {
    return NetworkConfigs[this.network][ETH.SUPPORTED_BLOCKCHAINS[this.blockchain]].PayerUrl
  }

  public getProviderUrl() {
    return NetworkConfigs[this.network][ETH.SUPPORTED_BLOCKCHAINS[this.blockchain]].RpcURL
  }

  public getLockProxyAddress() {
    return NetworkConfigs[this.network][ETH.SUPPORTED_BLOCKCHAINS[this.blockchain]].LockProxyAddr
  }

  public getBalanceReaderAddress() {
    return NetworkConfigs[this.network][ETH.SUPPORTED_BLOCKCHAINS[this.blockchain]].BalanceReader
  }

  public getWalletBytecodeHash() {
    return NetworkConfigs[this.network][ETH.SUPPORTED_BLOCKCHAINS[this.blockchain]].ByteCodeHash
  }
}