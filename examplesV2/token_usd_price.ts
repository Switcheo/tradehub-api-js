import * as BIP39 from "bip39";
import { TradeHubSDK } from '..';
import "./_setup";

(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic();
  console.log("mnemonic:", mnemonic);

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.MainNet,
    debugMode: false,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  await connectedSDK.initialize();

  const tokenDenomList = Object.keys(sdk.token.tokens);
  const randomTokenDenom = tokenDenomList[~~(Math.random() * tokenDenomList.length)]

  console.log("selected denom", randomTokenDenom);
  console.log("common denom", sdk.token.getCommonDenom(randomTokenDenom));
  console.log("symbol", sdk.token.getSymbol(randomTokenDenom));
  console.log("price", sdk.token.getUSDValue(randomTokenDenom)?.toString(10));
})().catch(console.error).finally(() => process.exit(0));
