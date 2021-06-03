import { Wallet } from "@zilliqa-js/account";
import { Zilliqa} from "@zilliqa-js/zilliqa";
import BigNumber from "bignumber.js";
import { APIClient } from "../api";
import { appendHexPrefix, Blockchain, NetworkConfig, NetworkConfigProvider, ZilNetworkConfig, stripHexPrefix} from "../utils";
import { RestResponse } from "../models";
// import { Token } from "@lib/models";


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

    public async getExternalBalances(api: APIClient, address: string, whitelistDenoms?: string[]) {
        const tokenList = await api.getTokens()
        const lockProxyAddress = this.getLockProxyAddress().toLowerCase()
        const tokens = tokenList.filter(token =>
          token.blockchain == this.blockchain &&
          token.asset_id.length == 40 &&
          token.lock_proxy_hash.toLowerCase() == stripHexPrefix(lockProxyAddress) &&
          (!whitelistDenoms || whitelistDenoms.includes(token.denom))
        )

        // todo delete me
        // const dummy1: Token = {
        //   name: 'ZIL-USDT',
        //   symbol: 'zUSDT',
        //   denom: '',
        //   decimals: Number(12),
        //   chain_id: Number(888),
        //   is_active: true,
        //   is_collateral: false,
        //   lock_proxy_hash: '',
        //   delegated_supply: '',
        //   originator: '',
        //   asset_id: "ced1f00d5088ef3d246fc622e9b0e5173f2216bf",
        //   blockchain: "zil",
        // }
        // tokens.push(dummy1)
        // const dummy2: Token = {
        //     name: 'ZIL-USDC',
        //     symbol: 'zUSDC',
        //     denom: '',
        //     decimals: Number(12),
        //     chain_id: Number(888),
        //     is_active: true,
        //     is_collateral: false,
        //     lock_proxy_hash: '',
        //     delegated_supply: '',
        //     originator: '',
        //     asset_id: "ca684b1ea0787937ee481bea03257283b09279bf",
        //     blockchain: "zil",
        //   }
        // tokens.push(dummy2)
        // todo delete me

        const requests = tokens.map(token => [token.asset_id, "balances", [appendHexPrefix(address)]])
        const zilliqa = new Zilliqa(this.getProviderUrl());
        const results = await zilliqa.blockchain.getSmartContractSubStateBatch(requests) as any
        const batch_result = results.batch_result
        if (batch_result.error !== undefined) {
            throw new Error(batch_result.error.message)
        }
        for (let r of batch_result) {
            (tokens[r.id - 1] as any).external_balance = r.result.balances[appendHexPrefix(address)]
        }
        return tokens
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


