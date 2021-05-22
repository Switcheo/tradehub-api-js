import { TradeHubSDK } from '..';
import "./_setup";

(async () => {
  const mnemonic = process.env.MINTER_MNEMONICS;
  console.log("mnemonic:", mnemonic);

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.TestNet,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  await connectedSDK.initialize();

  const recipientAddress = "tswth1p5fz7v286hmr8huhfxx4qzzgsgge6smktswwm6";
  const result = await connectedSDK.admin.mintTokens(recipientAddress);
  console.log(result);
})().catch(console.error).finally(() => process.exit(0));
