import { Transaction } from "@zilliqa-js/account";
import { Wallet } from "@zilliqa-js/account";
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { BN, bytes, Long } from "@zilliqa-js/util";
import { toChecksumAddress } from "@zilliqa-js/crypto"
import { RPCMethod } from "@zilliqa-js/core"
import BigNumber from "bignumber.js";
import { APIClient } from "../api";
import { ethers } from "ethers";
import { appendHexPrefix, Blockchain, NetworkConfig, NetworkConfigProvider, ZilNetworkConfig, stripHexPrefix, SWTHAddress } from "../utils";
import { RestModels } from "../models";

const uint128Max = "340282366920938463463374607431768211356"
const zeroAddress = "0000000000000000000000000000000000000000"

export declare type WalletProvider = Omit<Zilliqa & {
    wallet: Wallet & {
        net: string;
        defaultAccount: {
            base16: string;
            bech32: string;
        };
    };
}, // ugly hack for zilpay non-standard API
'subscriptionBuilder'>;

export interface ZILClientOpts {
    configProvider: NetworkConfigProvider,
    blockchain: Blockchain,
}

interface ZILTxParams {
    gasPrice: BigNumber
    gasLimit: BigNumber
    zilAddress: string
    signer: WalletProvider|string
}

export interface ZILLockParams extends ZILTxParams {
    address: Uint8Array
    amount: BigNumber
    token: RestModels.Token
    signCompleteCallback?: () => void
}

export interface ApproveZRC2Params extends ZILTxParams {
    token: RestModels.Token
    signCompleteCallback?: () => void
  }

export class ZILClient {
    static SUPPORTED_BLOCKCHAINS = [Blockchain.Zilliqa]
    static BLOCKCHAIN_KEY = {
        [Blockchain.Zilliqa]: "Zil"
    }
    
    private walletProvider?: WalletProvider // zilpay

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

    private async callContract(tx: Transaction, zilliqa: Zilliqa) {
        // need a tx obj such that await tx.confirm(tx.id) can be used to confirm the transactions
        if (this.walletProvider) {
            // zilpay
            try {
                const txn: any = await this.walletProvider.blockchain.createTransaction(tx)
                console.log("call contract", txn);
                tx.id = txn.id
                return tx
            } catch (err) {
                throw new Error(err)
            }
        }
        // others; privatekey
        await zilliqa.wallet.sign(tx)
        const response = await zilliqa.provider.send(RPCMethod.CreateTransaction, { ...tx.txParams })
        if (response.error !== undefined) {
            throw new Error(response.error.message)
        }
        tx.id = response.result.TranID
        return tx
    }

    public async approveZRC2(params: ApproveZRC2Params) {
        const { token, gasPrice, gasLimit, zilAddress, signer } = params
        const contractAddress = token.asset_id
        let zilliqa;

        if (typeof signer === 'string') {
            zilliqa = new Zilliqa(this.getProviderUrl())
            zilliqa.wallet.addByPrivateKey(signer)
        } else if (signer) {
            zilliqa = new Zilliqa(this.getProviderUrl(), signer.provider)
            this.walletProvider = signer
        } else {
            zilliqa = new Zilliqa(this.getProviderUrl())
        }

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
            gasPrice: new BN(gasPrice.toString()),
            gasLimit: Long.fromString(gasLimit.toString()),
        }

        const transitionParams = [
            {
                vname: 'spender',
                type: 'ByStr20',
                value: appendHexPrefix(token.lock_proxy_hash),
              },
              {
                  vname: 'amount',
                  type: 'Uint128',
                  value: uint128Max,
              },
        ]

        const data = {
            _tag: "IncreaseAllowance",
            params: [...transitionParams]
        }

        const tx = new Transaction(
            {
                ...callParams,
                toAddr: toChecksumAddress(contractAddress),
                data: JSON.stringify(data),
            },
            zilliqa.provider,
        )

        return await this.callContract(tx, zilliqa)
    }

    public async checkAllowanceZRC2(token: RestModels.Token, owner: string, spender: string) {
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

    public async lockDeposit(params: ZILLockParams) {
        const { address, amount, token, gasPrice, gasLimit, zilAddress, signer } = params
        const networkConfig = this.getNetworkConfig()

        const assetId = appendHexPrefix(token.asset_id)
        const targetProxyHash = appendHexPrefix(this.getTargetProxyHash(token))
        const feeAddress = appendHexPrefix(networkConfig.FeeAddress);
        const toAssetHash = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(token.denom))
        const swthAddress = ethers.utils.hexlify(address)
        const contractAddress = this.getLockProxyAddress()

        let zilliqa;

        if (typeof signer === 'string') {
            zilliqa = new Zilliqa(this.getProviderUrl())
            zilliqa.wallet.addByPrivateKey(signer)
        } else if (signer) {
            zilliqa = new Zilliqa(this.getProviderUrl(), signer.provider)
            this.walletProvider = signer
        } else {
            zilliqa = new Zilliqa(this.getProviderUrl())
        }

        const balanceAndNonceResp = await zilliqa.blockchain.getBalance(stripHexPrefix(zilAddress))
        if (balanceAndNonceResp.error !== undefined) {
            throw new Error(balanceAndNonceResp.error.message)
        }

        const nonce = balanceAndNonceResp.result.nonce + 1
        const version = bytes.pack(this.getConfig().ChainId,Number(1))

        let nativeAmt = new BN(0)
        if (token.asset_id == zeroAddress) {
            nativeAmt = new BN(amount.toString())
        }

        const callParams = {
            version: version,
            nonce: nonce,
            amount: nativeAmt,
            gasPrice: new BN(gasPrice.toString()),
            gasLimit: Long.fromString(gasLimit.toString()),
        }

        const transitionParams = [
            {
                vname: 'tokenAddr',
                type: 'ByStr20',
                value: assetId,
              },
              {
                  vname: 'targetProxyHash',
                  type: 'ByStr',
                  value: targetProxyHash,
              },
              {
                  vname: 'toAddress',
                  type: 'ByStr',
                  value: swthAddress,
              },
              {
                  vname: 'toAssetHash',
                  type: 'ByStr',
                  value: toAssetHash,
              },
              {
                  vname: 'feeAddr',
                  type: 'ByStr',
                  value: feeAddress,
              },
              {
                  vname: 'amount',
                  type: 'Uint256',
                  value: amount.toString(),
              },
              {
                  vname: 'feeAmount',
                  type: 'Uint256',
                  value: "0",
              },
              {
                  vname: 'callAmount',
                  type: 'Uint256',
                  value: "0",
              },
        ]

        const data = {
            _tag: "lock",
            params: [...transitionParams],
        }

        const tx = new Transaction(
            {
                ...callParams,
                toAddr: toChecksumAddress(contractAddress),
                data: JSON.stringify(data),
            },
            zilliqa.provider,
        )

        return await this.callContract(tx, zilliqa)
    }

    /**
     * TargetProxyHash is a hash of token originator address that is used
     * for lockproxy asset registration and identification
     * 
     * @param token
     */
    public getTargetProxyHash(token: RestModels.Token) {
      const networkConfig = this.getNetworkConfig();
      const addressBytes = SWTHAddress.getAddressBytes(token.originator, networkConfig.Network)
      const addressHex = stripHexPrefix(ethers.utils.hexlify(addressBytes))
      return addressHex
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
