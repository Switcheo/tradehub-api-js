import { TxMsgValue } from "@lib/tradehub/utils";

export interface UpdateProfile extends TxMsgValue {
    username: string,
    twitter: string,
    originator?: string,
}