import { supabase } from '@/lib/supabase'
import type { IMatch } from '@/interfaces/customs/matches/Matches'

const MATCH_SELECT = `
  id,
  match_date,
  stage,
  status,
  group_name,
  match_number,
  venue,
  home_score,
  away_score,
  winner_team_id,
  home_team:teams!home_team_id(id, name, code, flag_url),
  away_team:teams!away_team_id(id, name, code, flag_url)
`

export interface IUpdateMatchResultPayload {
  matchId: number
  homeScore: number
  awayScore: number
  winnerTeamId: number | null
}

export const useMatches = () => {
  const fetchMatches = async (): Promise<IMatch[]> => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(MATCH_SELECT)
        .order('match_date', { ascending: true })

      if (error || !data) return []

      return data as unknown as IMatch[]
    } catch {
      return []
    }
  }

  const updateMatchResult = async (payload: IUpdateMatchResultPayload): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .update({
          home_score: payload.homeScore,
          away_score: payload.awayScore,
          winner_team_id: payload.winnerTeamId,
          status: 'finished',
        })
        .eq('id', payload.matchId)
        .select('id')

      return !error && !!data && data.length > 0
    } catch {
      return false
    }
  }

  return { fetchMatches, updateMatchResult }
}
