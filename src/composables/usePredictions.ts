import { supabase } from '@/lib/supabase'
import type { IPrediction } from '@/interfaces/customs/predictions/Predictions'

export interface IUpsertPredictionPayload {
  userId: number
  matchId: number
  predictedHomeScore: number
  predictedAwayScore: number
}

export const usePredictions = () => {
  const fetchPredictionsByUser = async (userId: number): Promise<IPrediction[]> => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('id, match_id, predicted_home_score, predicted_away_score, points')
        .eq('user_id', userId)

      if (error || !data) return []

      return data
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
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,match_id' },
      )

      return !error
    } catch {
      return false
    }
  }

  return { fetchPredictionsByUser, upsertPrediction }
}
