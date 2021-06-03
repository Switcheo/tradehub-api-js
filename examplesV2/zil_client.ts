import { APIClient } from "../src/lib/tradehub/api";
import { ZILClient, ZILClientOpts} from "../src/lib/tradehub/clients/ZILClient";
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
}

run()