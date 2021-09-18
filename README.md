# Tradehub SDK

## Setup

Install from npm:

```
npm install tradehub-api-js
```

## Usage

```
import { TradeHubSDK } from "tradehub-api-js";

(async () => {
  const mnemonic = "your mnemonics here";

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.TestNet,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);
})();
```

See `/examplesV2` for some examples to help you get started.

All SDK functionalities are packaged in `/src/lib/tradehub`; `/examples` and the rest of `/src/lib` have been deprecated and are kept for backwards compatibility.
