import { Wallet } from "@zilliqa-js/account"
import BigNumber from "bignumber.js"
import { appendHexPrefix, Blockchain, NetworkConfig, NetworkConfigProvider, ZilNetworkConfig } from "../utils"
import { RestResponse } from "../models";


export interface ZILClientOpts {
    configProvider: NetworkConfigProvider,
    blockchain: Blockchain,
}

interface ZILTxParams {
    gasPrice: BigNumber
    gasLimit: BigNumber
    zilAddress: string
    wallet: Wallet
}

export interface LockParams extends ZILTxParams {
    address: Uint8Array
    amount: BigNumber
    token: RestResponse.Token
    signCompleteCallback?: () => void
}

export interface ApproveZRC2Params extends ZILTxParams {
    token: RestResponse.Token
    signCompleteCallback?: () => void
  }

export class ZILClient {
    static SUPPORTED_BLOCKCHAINS = [Blockchain.Zilliqa]
    static BLOCKCHAIN_KEY = {
        [Blockchain.Zilliqa]: "Zil"
    }
    private constructor(
        public readonly configProvider: NetworkConfigProvider,
        public readonly blockchain: Blockchain,
    ) { }

    public static instance(opts: ZILClientOpts) {
        const { configProvider, blockchain } = opts
        if (!ZILClient.SUPPORTED_BLOCKCHAINS.includes(blockchain)) {
            throw new Error(`unsupported blockchain - ${blockchain}`)
        }

        return new ZILClient(configProvider,blockchain)
    }



    public getNetworkConfig(): NetworkConfig {
        return this.configProvider.getConfig();
    }

    public getConfig(): ZilNetworkConfig {
        const networkConfig = this.getNetworkConfig();
        return networkConfig[ZILClient.BLOCKCHAIN_KEY[this.blockchain]];
    }

    public getProviderUrl() {
        return this.getConfig().RpcURL;
    }

    public getLockProxyAddress() {
        return this.getConfig().LockProxyAddr;
    }
}


