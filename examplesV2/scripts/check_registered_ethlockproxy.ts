import { ethers } from "ethers";
import { Blockchain, TradeHubSDK } from "../../build/main";
import { ETHClient } from "../../build/main/lib/tradehub/clients/ETHClient";
import { Network, NetworkConfigs } from "../../build/main/lib/tradehub/utils";
import { ABIs } from "../../build/main/lib/eth";

(async () => {
  const network = Network.DevNet;
  const ethClient = ETHClient.instance({
    blockchain: Blockchain.Ethereum,
    configProvider: {
      getConfig: () => NetworkConfigs[network],
    },
  });
  const lockProxyContract = new ethers.Contract(
    ethClient.getLockProxyAddress(),
    ABIs.lockProxy,
    ethClient.getProvider()
  );
  const sdk = await new TradeHubSDK({
    network: network,
    debugMode: false,
  });
  await sdk.initialize()
  const tokensList = Object.values(sdk.token.tokens);

  for (const token of tokensList) {
    if (token.blockchain === 'eth') {
      try {
        const isRegistered = await lockProxyContract.registry(token.asset_id)
        console.log(`${token.denom}: ${isRegistered}`)
      } catch (error) {
        console.log(`${token.denom}: ${error}`)
      };
    }
  };
})().catch(console.error).finally(() => process.exit(0))