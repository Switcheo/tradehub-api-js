import secp256k1 from 'secp256k1';
import * as BIP39 from "bip39";
import { TradeHubSDK, TradeHubWallet } from '..';
import "./_setup";
import { ethers } from 'ethers';

(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic()
  console.log("mnemonic:", mnemonic)

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.DevNet,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  const plaintext = "SWTH to the moon!";

  // TradeHubSigner applies sha256 to plaintext
  const signature = await connectedSDK.wallet.signer.sign(plaintext);

  // obtain actual signed message
  const hex = ethers.utils.sha256(Buffer.from(plaintext)).substring(2); // remove 0x prefix
  const message = Buffer.from(hex, "hex");

  // get public key buffer
  const publicKey = Buffer.from(connectedSDK.wallet.pubKeyBase64, "base64");

  // verify signature
  const result = secp256k1.ecdsaVerify(signature, message, publicKey);

  console.log("secp256k1 verify result", result);

  console.log("wallet verify result", TradeHubWallet.verifySignature(
    signature.toString("base64"),
    plaintext,
    connectedSDK.wallet.pubKeyBase64,
  ));
})().catch(console.error).finally(() => process.exit(0))
