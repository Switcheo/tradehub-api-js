import { TradeHubSDK } from '..';
import "./_setup";

(async () => {
  const mnemonic = process.env.MINTER_MNEMONICS;
  console.log("mnemonic:", mnemonic);

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.DevNet,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  await connectedSDK.initialize();

  const recipientAddress = "swth1pacamg4ey0nx6mrhr7qyhfj0g3pw359cnjyv6d";
  const result = await connectedSDK.admin.mintTokens(recipientAddress);
  console.log(result);
})().catch(console.error).finally(() => process.exit(0));
