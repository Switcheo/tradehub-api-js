import BigNumber from "bignumber.js";
import * as BIP39 from "bip39";
import { ethers } from "ethers";
import { SWTHAddress, TradeHubSDK } from '..';
import "./_setup";

(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic()
  console.log("mnemonic:", mnemonic)

  const sdk = await new TradeHubSDK({
    network: TradeHubSDK.Network.MainNet,
    debugMode: true,
  }).connectWithMnemonic(mnemonic);

  console.log("connected wallet:", sdk.wallet.bech32Address);

  // init eth wallet with mnemonics
  // const ethMnemonics = ""
  // const ethPrivateKeyBuff = ETHAddress.mnemonicToPrivateKey(ethMnemonics);
  // const ethPrivateKey = `0x${ethPrivateKeyBuff.toString("hex")}`;

  // init eth wallet with private key (e.g. 0x…)
  const ethPrivateKey = "";

  const ethersWallet = new ethers.Wallet(ethPrivateKey, sdk.eth.getProvider());
  const ethAddress = ethersWallet.address;

  // init eth wallet with metamask
  // const metamask = new MetaMask(sdk.network);
  // const ethersWallet = metamask.getSigner();
  // const ethAddress = metamask.defaultAccount()

  console.log("eth address", ethAddress);

  await sdk.token.reloadTokens();
  const token = sdk.token.tokens["swth-e"]

  const gasPrice = await sdk.eth.getProvider().getGasPrice();
  const gasPriceGwei = new BigNumber(gasPrice.toString()).shiftedBy(-9);
  const depositAmt = new BigNumber(1).shiftedBy(token.decimals);

  const allowance = await sdk.eth.checkAllowanceERC20(token, ethAddress, `0x${token.lock_proxy_hash}`);
  if (allowance.lt(depositAmt)) {
    const approveTx = await sdk.eth.approveERC20({
      token,
      gasLimit: new BigNumber(100000),
      gasPriceGwei,
      ethAddress,
      signer: ethersWallet,
    });
  
    console.log("approve tx", approveTx.hash)
    await approveTx.wait()
  }
  
  const swthAddress = sdk.wallet.bech32Address;
  const addressBytes = SWTHAddress.getAddressBytes(swthAddress, sdk.network);
  const depositTx = await sdk.eth.lockDeposit({
    token,
    address: addressBytes,
    ethAddress,
    gasLimit: new BigNumber(250000),
    amount: depositAmt,
    gasPriceGwei,
    signer: ethersWallet,
  })

  console.log("deposit tx", depositTx.hash)
  await depositTx.wait()
})().catch(console.error).finally(() => process.exit(0))
