export interface IPrediction {
  id: number
  match_id: number
  predicted_home_score: number
  predicted_away_score: number
  predicted_winner_team_id: number | null
  points: number | null
}

export interface IUserPrediction {
  predicted_home_score: number
  predicted_away_score: number
  predicted_winner_team_id: number | null
  user: {
    display_name: string
  }
}

export interface IAuditMatch {
  id: number
  match_date: string
  home_score: number
  away_score: number
  home_team: { name: string }
  away_team: { name: string }
  predictions: {
    predicted_home_score: number
    predicted_away_score: number
    points: number | null
    updated_at: string | null
    user: { display_name: string }
  }[]
}
