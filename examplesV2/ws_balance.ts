import * as BIP39 from "bip39";
import { TradeHubSDK } from '..';
import { WSChannel } from "../build/main/lib/tradehub/websocket/types";
import "./_setup";

(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic();
  console.log("mnemonic:", mnemonic);

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.TestNet,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  await connectedSDK.initialize();

  connectedSDK.ws.subscribe({
    address: connectedSDK.getConnectedWallet().bech32Address,
    channel: WSChannel.balances
  }, (message) => {
    const balances = (message.data as any).result;
    console.log("balance update", balances);
  });
})().catch(console.error);
