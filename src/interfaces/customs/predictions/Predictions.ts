export interface IPrediction {
  id: number
  match_id: number
  predicted_home_score: number
  predicted_away_score: number
  points: number | null
}
