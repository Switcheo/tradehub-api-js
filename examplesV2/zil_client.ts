import { ZILClient, ZILClientOpts} from "../src/lib/tradehub/clients/ZILClient";
import { Blockchain } from "../src/lib/tradehub/utils";
import { Network, NetworkConfigProvider, NetworkConfigs } from "../src/lib/tradehub/utils/network";

async function run() {
    console.log("testing zilliqa clinet")
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
}

run()