import { RestResponse } from "@lib/tradehub/models";

export interface GetWalletBalanceResponse extends RestResponse.Balances {}

/**
 * @param account Only returns balances of this address
 */
export interface GetWalletBalanceOpts {
  account: string,
}
