import { supabase } from '@/lib/supabase'
import type { IUserRanking } from '@/interfaces/customs/rankings/Rankings'

interface IUserRankingRow {
  id: number
  display_name: string
  predictions: { points: number | null }[]
}

export const useRankings = () => {
  const fetchUserRankings = async (): Promise<IUserRanking[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, display_name, predictions(points)')

      if (error || !data) return []

      return (data as unknown as IUserRankingRow[])
        .map((user) => ({
          id: user.id,
          display_name: user.display_name,
          total_points: user.predictions.reduce(
            (sum, prediction) => sum + (prediction.points ?? 0),
            0,
          ),
        }))
        .sort((a, b) => b.total_points - a.total_points)
    } catch {
      return []
    }
  }

  return { fetchUserRankings }
}
