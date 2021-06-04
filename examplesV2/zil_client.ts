import BN from "bn.js";
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { Long } from "@zilliqa-js/util";
import { Wallet } from "@zilliqa-js/account"
import { APIClient } from "../src/lib/tradehub/api";
import { ApproveZRC2Params, ZILClient, ZILClientOpts} from "../src/lib/tradehub/clients/ZILClient";
import { RestResponse } from "../src/lib/tradehub/models";
import { Blockchain } from "../src/lib/tradehub/utils";
import { Network, NetworkConfigProvider, NetworkConfigs } from "../src/lib/tradehub/utils/network";
import { getAddressFromPrivateKey } from "@zilliqa-js/crypto";

async function run() {
    console.log("testing zilliqa client")
    const networkConfigProvider: NetworkConfigProvider = {
        getConfig: function () {
            return NetworkConfigs[Network.DevNet]
        },
    }
    const opts: ZILClientOpts = {
        configProvider: networkConfigProvider,
        blockchain: Blockchain.Zilliqa,
    }
    const client = ZILClient.instance(opts)
    const switcheo = new APIClient(NetworkConfigs.devnet.RestURL)

    const tokens = await client.getExternalBalances(switcheo, "2141bf8b6d2213d4d7204e2ddab92653dc245c5f")
    console.log(tokens)

    const token: RestResponse.Token = {
      name: 'Zilliqa USD',
      symbol: 'zUSD',
      denom: 'zusd6',
      decimals: 12,
      blockchain: 'zil',
      chain_id: 110,
      asset_id: 'ced1f00d5088ef3d246fc622e9b0e5173f2216bf',
      is_active: true,
      is_collateral: false,
      lock_proxy_hash: 'fc85a264c86148213ca4afb5dd9596d95234f0ba',
      delegated_supply: '0',
      originator: 'swth1pacamg4ey0nx6mrhr7qyhfj0g3pw359cnjyv6d',
    }

    // check allowance
    const allowace = await client.checkAllowanceZRC2(token,"0x2141bf8b6d2213d4d7204e2ddab92653dc245c5f","0xa476fcedc061797fa2a6f80bd9e020a056904298")
    console.log(allowace)
    
    const privateKey = '8c96c599fdb70e6ebdebe9b10473fd7b12b5e8924a724e2b9570436c44eb0ecd'
    const address = getAddressFromPrivateKey(privateKey)
    const zilliqa = new Zilliqa(client.getProviderUrl())
    const wallet  = new Wallet(zilliqa.network.provider)
    wallet.addByPrivateKey(privateKey)

    // approve zrc2 (increase allowance)
    const approveZRC2Params: ApproveZRC2Params = {
        token: token,
        gasPrice: new BN("2000000000"),
        gasLimit: Long.fromNumber(25000),
        zilAddress: address,
        signer: wallet,
    }

    await client.approveZRC2(approveZRC2Params)

}

run()