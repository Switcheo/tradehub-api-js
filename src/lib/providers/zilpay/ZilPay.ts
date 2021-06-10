import { Blockchain } from "@lib/constants";
import { Network } from '@lib/types'
import { Signer } from "@zilliqa-js/core"

export interface ZilPayChangeNetworkParam {
    chainId: number,
    chainname: string,
    rpcUrl?: string,
}

interface ZilPayAPI {
}

export class ZilPay {
    private blockchain: Blockchain = Blockchain.Zilliqa

    static getNetworkParams(network: Network): ZilPayChangeNetworkParam {
        if (network === Network.MainNet) {
            // currently zilpay only used by zilliqa
            return {
                chainId: Number(1),
                chainname: 'Zilliqa Mainnet',
                rpcUrl: 'https://api.zilliqa.com'
            }
        }


        if (network == Network.DevNet) {
            return {
                chainId: Number(999),
                chainname: 'Zilliqa Devnet',
                rpcUrl: 'https://poly-api.zilliqa.com'
            }
        }

        return {
            chainId: Number(333),
            chainname: 'Zilliqa Testnet',
            rpcUrl: 'https://dev-api.zilliqa.com'
        }
    }

    static getRequiredChainId(network: Network) {
        if (network === Network.MainNet) {
            return 1
        }

        if (network === Network.DevNet) {
            return 888
        }

        // Testnet
        return 333
    }

    constructor(
        public readonly network: Network,
    ) { }

    public getBlockchain(): Blockchain {
        return this.blockchain
    }

    async getSigner(): Promise<Signer> {
        const zil = await this.getConnectedAPI()
        return (zil as any).wallet
    }

    async getConnectedAPI(): Promise<ZilPayAPI> {
        const zilPayAPI = this.getAPI()
        if (!zilPayAPI) {
            throw new Error('ZilPay not connected, please check that your extension is enabled')
        }

        const isConnect = await (zilPayAPI as any).wallet.connect()
        if (!isConnect) {
            throw new Error('user reject')
        }
        return this.getAPI()

    }

    getAPI(): ZilPayAPI  | null {
        return (window as any).zilPay as ZilPayAPI | null ?? null
    }

}