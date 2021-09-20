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
    debugMode: true,
  });

  const tokensList = Object.values(sdk.token.tokens);
  
  for(const tokenAddress of tokensList) {
    const isRegistered = await lockProxyContract.registry(tokenAddress)
    console.log(isRegistered)
  };
})().catch(console.error).finally(() => process.exit(0))