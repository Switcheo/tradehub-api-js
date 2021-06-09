export interface Leaderboard {
    count: string
    data: LeaderboardData[]
    from_block: string
    from_time: string
    limit: string
    market: string
    offset: string
    order: string
    to_block: string
    to_time: string
}

interface LeaderboardData {
    address: string
    realized_pnl: string
    username: string
}
