import { NEOAddress, TradeHubSDK } from '..';
import "./_setup";

(async () => {
  const mnemonic = "update evolve debate galaxy process trophy flame aspect abuse warfare scorpion reward"
  console.log("mnemonic:", mnemonic);

  console.log(NEOAddress.generateAddress(mnemonic));

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.TestNet,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  const account = connectedSDK.wallet.account;
  console.log("loaded account", account);
})().catch(console.error).finally(() => process.exit(0));
