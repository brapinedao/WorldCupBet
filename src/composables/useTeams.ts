import { supabase } from '@/lib/supabase'
import type { IGroupTeam } from '@/interfaces/customs/teams/Teams'

export const useTeams = () => {
  const fetchTeams = async (): Promise<IGroupTeam[]> => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, code, flag_url, group_name')
        .order('group_name', { ascending: true })
        .order('name', { ascending: true })

      if (error || !data) return []

      return data
    } catch {
      return []
    }
  }

  return { fetchTeams }
}
