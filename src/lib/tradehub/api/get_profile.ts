import { Profile } from "@lib/models";

export interface GetProfileResponse extends Profile { }

/**
 * @param address TradeHub address to query
 */
export interface GetProfileOpts {
  address?: string
}
