import { ethers } from "ethers";
import { Blockchain, TradeHubSDK } from "../../build/main";
import { ABIs } from "../../build/main/lib/eth";
import { NetworkConfigs } from "../../build/main/lib/tradehub/utils";

const RPC_URL = NetworkConfigs.mainnet.Eth.RpcURL; // "https://mainnet.infura.io/v3/";
const CHECK_CHAIN = Blockchain.BinanceSmartChain;

(async () => {
  const sdk = await new TradeHubSDK({
    network: TradeHubSDK.Network.MainNet,
    debugMode: false,
  });
  await sdk.initialize()
  const tokensList = Object.values(sdk.token.tokens);
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

  for (const token of tokensList) {
    if (token.blockchain !== CHECK_CHAIN) {
      continue;
    }

    try {
      const lockProxyContract = new ethers.Contract(
        `0x${token.lock_proxy_hash}`,
        ABIs.lockProxy,
        provider,
      );

      const isRegistered = await lockProxyContract.registry(token.asset_id)

      if (isRegistered === "0x0000000000000000000000000000000000000000000000000000000000000000")
        console.log(`${token.denom}: ${isRegistered}`)
    } catch (error) {
      console.log(`${token.denom}: ${error}`)
    };
  };
})().catch(console.error).finally(() => process.exit(0))
