import { CosmosLedger, TradeHubSDK } from '..';
import { StdSignDoc } from "../build/main/lib/tradehub/utils";
import "./_setup";

(async () => {
  // NOTE: will not run unless on browser 
  const ledger = new CosmosLedger();
  console.log("ledger:", ledger.getCosmosAddress());

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.TestNet,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithLedger(ledger, {
    onRequestSign: async (signDoc: StdSignDoc) => {
      console.log("requesting sign", signDoc);
    },
    onSignComplete: async (signatureBase64: string) => {
      console.log("sign complete", signatureBase64);
    },
  })
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  const account = connectedSDK.wallet.account;
  console.log("loaded account", account);
})().catch(console.error).finally(() => process.exit(0));
