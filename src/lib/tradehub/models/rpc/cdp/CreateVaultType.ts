import { TxMsgValue } from "@lib/tradehub/utils";

export interface CreateVaultType extends TxMsgValue {
    collateral_denom: string
    debt_denom: string
    collateralization_ratio: string
    originator?: string
}