import { supabase } from '@/lib/supabase'
import type {
  IAuditMatch,
  IPrediction,
  IUserPrediction,
} from '@/interfaces/customs/predictions/Predictions'

export interface IUpsertPredictionPayload {
  userId: number
  matchId: number
  predictedHomeScore: number
  predictedAwayScore: number
  predictedWinnerTeamId: number | null
}

export const usePredictions = () => {
  const fetchPredictionsByUser = async (userId: number): Promise<IPrediction[]> => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select(
          'id, match_id, predicted_home_score, predicted_away_score, predicted_winner_team_id, points',
        )
        .eq('user_id', userId)

      if (error || !data) return []

      return data
    } catch {
      return []
    }
  }

  const fetchPredictionsByMatch = async (matchId: number): Promise<IUserPrediction[]> => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select(
          'predicted_home_score, predicted_away_score, predicted_winner_team_id, user:users(display_name)',
        )
        .eq('match_id', matchId)

      if (error || !data) return []

      return data as unknown as IUserPrediction[]
    } catch {
      return []
    }
  }

  const upsertPrediction = async (payload: IUpsertPredictionPayload): Promise<boolean> => {
    try {
      const { error } = await supabase.from('predictions').upsert(
        {
          user_id: payload.userId,
          match_id: payload.matchId,
          predicted_home_score: payload.predictedHomeScore,
          predicted_away_score: payload.predictedAwayScore,
          predicted_winner_team_id: payload.predictedWinnerTeamId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,match_id' },
      )

      return !error
    } catch {
      return false
    }
  }

  const fetchAuditData = async (): Promise<IAuditMatch[]> => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(
          `
          id,
          match_date,
          home_score,
          away_score,
          home_team:teams!home_team_id(name),
          away_team:teams!away_team_id(name),
          predictions(
            predicted_home_score,
            predicted_away_score,
            points,
            updated_at,
            user:users(display_name)
          )
        `,
        )
        .eq('status', 'finished')
        .order('match_date', { ascending: true })

      if (error || !data) return []

      return data as unknown as IAuditMatch[]
    } catch {
      return []
    }
  }

  return { fetchPredictionsByUser, fetchPredictionsByMatch, upsertPrediction, fetchAuditData }
}
