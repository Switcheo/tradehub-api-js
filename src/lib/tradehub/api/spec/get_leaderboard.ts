import { RestModels } from "@lib/tradehub/models";

export interface GetLeaderboardResponse extends RestModels.Leaderboard {}

export interface GetLeaderboardOpts {
    market?: string
    limit?: number
    offset?: number
    order?: string
    from?: number
    to?: number
}
