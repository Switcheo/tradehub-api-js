export interface LeaderboardResult {
    count: string
    data: Leaderboard[]
    from_block: string
    from_time: string
    limit: string
    market: string
    offset: string
    order: string
    to_block: string
    to_time: string
}

export interface Leaderboard {
    address: string
    realized_pnl: string
    username: string
}
