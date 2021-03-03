import { getBech32Prefix, NETWORK, Network as NetworkConfig } from "@tradehub/config";
import { Blockchain } from "@tradehub/constants";
import { ABIs } from "@tradehub/eth";
import { Token } from "@tradehub/models";
import { Network } from "@tradehub/types";
import { Address } from "@tradehub/utils";
import fetch from "@tradehub/utils/fetch";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import stripHexPrefix from 'strip-hex-prefix';

export interface ETHClientOpts {
  network: Network,
  blockchain: Blockchain,
}

interface ETHTxParams {
  gasPriceGwei: BigNumber
  gasLimit: BigNumber
  ethAddress: string
  signer: ethers.Signer
}

export interface LockParams extends ETHTxParams {
  address: Uint8Array
  amount: BigNumber
  token: Token
  signCompleteCallback?: () => void
}
export interface ApproveERC20Params extends ETHTxParams {
  token: Token
  signCompleteCallback?: () => void
}


/**
 * stop-gap be refactored
 * aim: decouple with wallet instance
 */
const getTokens = async (network: Network) => {
  const url = `${NETWORK[network].REST_URL}/get_tokens`
  const response = await fetch(url)
  const body = await response.json()
  return body as Token[]
}

/**
 * stop-gap be refactored
 * aim: decouple with wallet instance
 */
const getTargetProxyHash = (token: Token, networkConfig: NetworkConfig) => {
  const prefix = getBech32Prefix(networkConfig, 'main')
  const address = Address.fromBech32(prefix, token.originator)
  const addressBytes = address.toBytes()
  const addressHex = stripHexPrefix(ethers.utils.hexlify(addressBytes))
  return addressHex
}

export class ETHClient {
  static SUPPORTED_BLOCKCHAINS = [Blockchain.BinanceSmartChain, Blockchain.Ethereum]

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

  public async getExternalBalances(address: string, whitelistDenoms?: string[]) {
    const tokenList = await getTokens(this.network)
    const lockProxyAddress = this.getLockProxyAddress()
    const tokens = tokenList.filter(token =>
      token.blockchain == this.blockchain &&
      token.asset_id.length == 40 &&
      ('0x' + token.lock_proxy_hash).toLowerCase() == lockProxyAddress &&
      (!whitelistDenoms || whitelistDenoms.includes(token.denom))
    )
    const assetIds = tokens.map(token => '0x' + token.asset_id)
    const provider = this.getProvider()
    const contractAddress = this.getBalanceReaderAddress()
    const contract = new ethers.Contract(contractAddress, ABIs.balanceReader, provider)

    const balances = await contract.getBalances(address, assetIds)
    for (let i = 0; i < tokens.length; i++) {
      (tokens[i] as any).external_balance = balances[i].toString()
    }

    return tokens
  }


  public async approveERC20(params: ApproveERC20Params) {
    const { token, gasPriceGwei, gasLimit, ethAddress, signer } = params
    const contractAddress = token.asset_id

    const rpcProvider = this.getProvider()
    const contract = new ethers.Contract(contractAddress, ABIs.erc20, rpcProvider)

    const nonce = await rpcProvider.getTransactionCount(ethAddress)
    const approveResultTx = await contract.connect(signer).approve(
      token.lock_proxy_hash,
      ethers.constants.MaxUint256,
      {
        nonce,
        gasPrice: gasPriceGwei.shiftedBy(9).toString(10),
        gasLimit: gasLimit.toString(10),
      },
    )

    return approveResultTx
  }

  public async checkAllowanceERC20(token: Token, owner: string, spender: string) {
    const contractAddress = token.asset_id
    const rpcProvider = this.getProvider()
    const contract = new ethers.Contract(contractAddress, ABIs.erc20, rpcProvider)
    const allowance = await contract.allowance(owner, spender)
    return new BigNumber(allowance.toString())
  }

  public async lockDeposit(params: LockParams) {
    const { address, token, amount, gasPriceGwei, gasLimit, ethAddress, signer } = params

    if (gasLimit.lt(150000)) {
      throw new Error('Minimum gas required: 150,000')
    }

    const networkConfigs = NETWORK[this.network]

    const assetId = `0x${token.asset_id}`
    const targetProxyHash = `0x${getTargetProxyHash(token, networkConfigs)}`
    const feeAddress = `0x${networkConfigs.FEE_ADDRESS}`
    const toAssetHash = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(token.denom))

    const swthAddress = ethers.utils.hexlify(address)
    const contractAddress = this.getLockProxyAddress()

    const rpcProvider = this.getProvider()

    const nonce = await rpcProvider.getTransactionCount(ethAddress)
    const contract = new ethers.Contract(contractAddress, ABIs.lockProxy, rpcProvider)
    const lockResultTx = await contract.connect(signer).lock( // eslint-disable-line no-await-in-loop
      assetId, // _assetHash
      targetProxyHash, // _targetProxyHash
      swthAddress, // _toAddress
      toAssetHash, // _toAssetHash
      feeAddress, // _feeAddress
      [ // _values
        amount.toString(), // amount
        '0', // feeAmount
        amount.toString(), // callAmount
      ],
      {
        nonce,
        value: '0',
        gasPrice: gasPriceGwei.shiftedBy(9).toString(10),
        gasLimit: gasLimit.toString(10),

        // add tx value for ETH deposits, omit if ERC20 token
        ...token.asset_id === '0000000000000000000000000000000000000000' && {
          value: amount.toString(),
        },
      },
    )

    return lockResultTx
  }

  public async isContract(address: string) {
    const provider = this.getProvider()
    const code = await provider.getCode(address)
    // non-contract addresses should return 0x
    return code != '0x'
  }

  public getProvider() {
    return new ethers.providers.JsonRpcProvider(this.getProviderUrl())
  }

  public getProviderUrl() {
    return clientConfig[this.blockchain][this.network].providerUrl
  }

  public getLockProxyAddress() {
    return clientConfig[this.blockchain][this.network].lockProxyAddress
  }

  public getBalanceReaderAddress() {
    return clientConfig[this.blockchain][this.network].balanceReaderAddress
  }
}

interface ClientNetworkConfig {
  providerUrl: string
  balanceReaderAddress: string
  lockProxyAddress: string
}
interface BlockchainConfig {
  [network: string]: ClientNetworkConfig
}
interface ETHClientConfig {
  [blockchain: string]: BlockchainConfig
}

export const clientConfig: ETHClientConfig = {
  [Blockchain.Ethereum]: {
    [Network.LocalHost]: {
      providerUrl: NETWORK[Network.LocalHost].ETH_URL,
      balanceReaderAddress: NETWORK[Network.LocalHost].ETH_BALANCE_READER,
      lockProxyAddress: NETWORK[Network.LocalHost].ETH_LOCKPROXY,
    },
    [Network.DevNet]: {
      providerUrl: NETWORK[Network.DevNet].ETH_URL,
      balanceReaderAddress: NETWORK[Network.DevNet].ETH_BALANCE_READER,
      lockProxyAddress: NETWORK[Network.DevNet].ETH_LOCKPROXY,
    },
    [Network.TestNet]: {
      providerUrl: NETWORK[Network.TestNet].ETH_URL,
      balanceReaderAddress: NETWORK[Network.TestNet].ETH_BALANCE_READER,
      lockProxyAddress: NETWORK[Network.TestNet].ETH_LOCKPROXY,
    },
    [Network.MainNet]: {
      providerUrl: NETWORK[Network.MainNet].ETH_URL,
      balanceReaderAddress: NETWORK[Network.MainNet].ETH_BALANCE_READER,
      lockProxyAddress: NETWORK[Network.MainNet].ETH_LOCKPROXY,
    },
  },
  [Blockchain.BinanceSmartChain]: {
    [Network.LocalHost]: {
      providerUrl: NETWORK[Network.LocalHost].BSC_URL,
      balanceReaderAddress: NETWORK[Network.LocalHost].BSC_BALANCE_READER,
      lockProxyAddress: NETWORK[Network.LocalHost].BSC_LOCKPROXY,
    },
    [Network.DevNet]: {
      providerUrl: NETWORK[Network.DevNet].BSC_URL,
      balanceReaderAddress: NETWORK[Network.DevNet].BSC_BALANCE_READER,
      lockProxyAddress: NETWORK[Network.DevNet].BSC_LOCKPROXY,
    },
    [Network.TestNet]: {
      providerUrl: NETWORK[Network.TestNet].BSC_URL,
      balanceReaderAddress: NETWORK[Network.TestNet].BSC_BALANCE_READER,
      lockProxyAddress: NETWORK[Network.TestNet].BSC_LOCKPROXY,
    },
    [Network.MainNet]: {
      providerUrl: NETWORK[Network.MainNet].BSC_URL,
      balanceReaderAddress: NETWORK[Network.MainNet].BSC_BALANCE_READER,
      lockProxyAddress: NETWORK[Network.MainNet].BSC_LOCKPROXY,
    },
  }
} as const
