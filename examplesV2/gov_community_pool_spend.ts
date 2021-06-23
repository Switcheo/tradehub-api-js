import * as BIP39 from "bip39";
import { RPCParams, TradeHubSDK } from '../build/main';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic();
  console.log("mnemonic:", mnemonic);

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.LocalHost,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  await connectedSDK.initialize();

  const result = await connectedSDK.governance.submitProposal<RPCParams.CommunityPoolSpendProposal>(
    RPCParams.Proposal.Type.CommunityPoolSpend, 
    {
      title: "test",
      description: "test",
      recipient: connectedSDK.wallet.bech32Address,
      amount: [{
        denom: "swth",
        amount: "10000000",
      }],
    },
  );

  console.log(result);
})().catch(console.error).finally(() => process.exit(0));
