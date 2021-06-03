import { APIClient } from "../src/lib/tradehub/api";
import { ZILClient, ZILClientOpts} from "../src/lib/tradehub/clients/ZILClient";
import { RestResponse } from "../src/lib/tradehub/models";
import { Blockchain } from "../src/lib/tradehub/utils";
import { Network, NetworkConfigProvider, NetworkConfigs } from "../src/lib/tradehub/utils/network";

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

    const allowace = await client.checkAllowanceZRC2(token,"0x2141bf8b6d2213d4d7204e2ddab92653dc245c5f","0xa476fcedc061797fa2a6f80bd9e020a056904298")
    console.log(allowace)
}

run()