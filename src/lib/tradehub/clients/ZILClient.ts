import { Transaction } from "@zilliqa-js/account";
import { Zilliqa} from "@zilliqa-js/zilliqa";
import { BN, bytes } from "@zilliqa-js/util";
import { toChecksumAddress } from "@zilliqa-js/crypto"
import { Signer, RPCMethod } from "@zilliqa-js/core"
import BigNumber from "bignumber.js";
import { APIClient } from "../api";
import { appendHexPrefix, Blockchain, NetworkConfig, NetworkConfigProvider, ZilNetworkConfig, stripHexPrefix} from "../utils";
import { RestResponse } from "../models";

export interface ZILClientOpts {
    configProvider: NetworkConfigProvider,
    blockchain: Blockchain,
}

interface ZILTxParams {
    gasPrice: BN
    gasLimit: Long
    zilAddress: string
    signer: Signer
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

        const requests = tokens.map(token => [token.asset_id, "balances", [appendHexPrefix(address)]])
        const zilliqa = new Zilliqa(this.getProviderUrl())
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

    public async approveZRC2(params: ApproveZRC2Params) {
        const { token, gasPrice, gasLimit, zilAddress, signer } = params
        const contractAddress = token.asset_id
        const zilliqa = new Zilliqa(this.getProviderUrl())

        const balanceAndNonceResp = await zilliqa.blockchain.getBalance(stripHexPrefix(zilAddress))
        if (balanceAndNonceResp.error !== undefined) {
            throw new Error(balanceAndNonceResp.error.message)
        }

        const nonce = balanceAndNonceResp.result.nonce + 1
        const version = bytes.pack(this.getConfig().ChainId,Number(1))

        const callParams = {
            version: version,
            nonce: nonce,
            amount: new BN(0),
            gasPrice: gasPrice,
            gasLimit: gasLimit,
        }

        const data = {
            _tag: "IncreaseAllowance",
            params: [
                {
                  vname: 'spender',
                  type: 'ByStr20',
                  value: appendHexPrefix(token.lock_proxy_hash),
                },
                {
                    vname: 'amount',
                    type: 'Uint128',
                    value: "340282366920938463463374607431768211356"
                },
              ],
        }
        const tx = new Transaction(
            {
                ...callParams,
                toAddr: toChecksumAddress(contractAddress),
                data: JSON.stringify(data),
            },
            zilliqa.provider,
        )
        await signer.sign(tx)
        const response = await zilliqa.provider.send(RPCMethod.CreateTransaction, { ...tx.txParams })
        console.log(response)
    }

    public async checkAllowanceZRC2(token: RestResponse.Token, owner: string, spender: string) {
        const contractAddress = token.asset_id
        const zilliqa = new Zilliqa(this.getProviderUrl())
        const resp = await zilliqa.blockchain.getSmartContractSubState(contractAddress, "allowances",[owner,spender])
        if (resp.error !== undefined) {
            throw new Error(resp.error.message)
        }

        if (resp.result === null) {
            return new BigNumber("0")
        }

        return new BigNumber(resp.result.allowances[owner][spender])

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

