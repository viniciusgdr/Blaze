export declare interface BlazeEventMap {
  'crash.tick': {
    id: string
    updated_at: string
    status: string
    crash_point: number | null
    // Only on crash_2
    is_bonus_round: boolean
  }
  // Only on crash_2
  'crash.tick-bets': {
    id: string
    roomId: number
    total_eur_bet: number
    total_bets_placed: string
    total_eur_won: number
    bets: Bet[]
  }
  'double.tick': {
    id: string
    color: string | null
    roll: string | null
    created_at: string
    updated_at: string
    status: 'rolling' | 'waiting' | 'complete'
    total_red_eur_bet: number
    total_red_bets_placed: number
    total_white_eur_bet: number
    total_white_bets_placed: number
    total_black_eur_bet: number
    total_black_bets_placed: number
    bets: Bet[]
  }
  'chat.message': {
    id: string
    text: string
    available: boolean
    created_at: string
    user: {
      id: string
      username: string
      rank: string
      label: string | null
      level: number
    }
  }
  'close': {
    code: number
    reconnect: boolean
  }
  'subscriptions': string[]
}

export interface Bet {
  id: string
  cashed_out_at: number | null
  amount: number
  currency_type: string
  user: {
    id: string
    id_str: string
    username: string
    rank: string
  }
  win_amount: string
  status: 'win' | 'created'
}
