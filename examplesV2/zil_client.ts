import { APIClient } from "../src/lib/tradehub/api";
import { ApproveZRC2Params, ZILLockParams, ZILClient, ZILClientOpts} from "../src/lib/tradehub/clients/ZILClient";
import { Blockchain, SWTHAddress } from "../src/lib/tradehub/utils";
import { Network, NetworkConfigProvider, NetworkConfigs } from "../src/lib/tradehub/utils/network";
import { getAddressFromPrivateKey } from "@zilliqa-js/crypto";
import BigNumber from "bignumber.js";
import { Token } from "../src/lib/tradehub/models/rest";

async function run() {
    console.log("testing zilliqa client")
    const networkConfigProvider: NetworkConfigProvider = {
        getConfig: function () {
            return NetworkConfigs[Network.DevNet]
        },
    }
    const opts: ZILClientOpts = {
        configProvider: networkConfigProvider,
        blockchain: Blockchain.Zilliqa,
    }
    const client = ZILClient.instance(opts)
    const switcheo = new APIClient(NetworkConfigs.devnet.RestURL)
    console.log(switcheo)
    const asset: Token = await switcheo.getToken({ token: "zusdt" })

    // check allowance
    const allowace = await client.checkAllowanceZRC2(asset,"0x2141bf8b6d2213d4d7204e2ddab92653dc245c5f","0xa476fcedc061797fa2a6f80bd9e020a056904298")
    console.log(allowace)

    const depositAmtQa = new BigNumber("1000000000000") // for zil, deposit amt is convert to Qa
    const privateKey = '8c96c599fdb70e6ebdebe9b10473fd7b12b5e8924a724e2b9570436c44eb0ecd'
    const address = getAddressFromPrivateKey(privateKey)
    console.log(address)

    if (allowace.lt(depositAmtQa)) {
        // approve zrc2 (increase allowance)
        const approveZRC2Params: ApproveZRC2Params = {
            token: asset,
            gasPrice: new BigNumber("2000000000"),
            gasLimit: new BigNumber(25000),
            zilAddress: address,
            signer: privateKey,  // for zilpay: set to window.zilPay
        }
        console.log("approve zrc2 token parameters: ", approveZRC2Params)
        console.log("sending approve transactions")
        const tx = await client.approveZRC2(approveZRC2Params)
        console.log("performing transaction confirmation, transaction id is: ", tx.id)
        await tx.confirm(tx.id)
        console.log("transaction confirmed! receipt is: ", tx.getReceipt())

        /**
         * 
         * if using zilPay, tx.confirm(tx.id cannot be used)
         * instead create a empty txn object with the toAddr
         * 
         * const toAddr = tx.toAddr // must be checksummed or bech32
         * const emptyTx = new Transaction({ toAddr: toAddr }, new HTTPProvider("https://dev-api.zilliqa.com"))
         * const confirmedTxn = await emptyTx.confirm(tx.id)
         * console.log(confirmedTxn.receipt);
         * 
        **/
    }

    // lock deposit
    const lockDepositParams: ZILLockParams = {
        address: SWTHAddress.getAddressBytes("swth1pacamg4ey0nx6mrhr7qyhfj0g3pw359cnjyv6d", Network.DevNet),
        amount: new BigNumber("1000000000000"),
        token: asset,
        gasPrice: new BigNumber("2000000000"),
        zilAddress: address,
        gasLimit: new BigNumber(25000),
        signer: privateKey, // for zilpay: set to window.zilPay
    }
    console.log("lock deposit parameters: ", lockDepositParams)
    console.log("sending lock deposit transactions")
    const tx = await client.lockDeposit(lockDepositParams)
    console.log("performing transaction confirmation, transaction id is: ", tx.id)
}

run()