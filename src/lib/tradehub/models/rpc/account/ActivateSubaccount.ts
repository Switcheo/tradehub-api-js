import { TxMsgValue } from "@lib/tradehub/utils";

export interface ActivateSubAccount extends TxMsgValue {
    expected_main_account: string,
    originator?: string,
}