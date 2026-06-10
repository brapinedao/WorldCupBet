import { supabase } from '@/lib/supabase'
import type { IUser } from '@/interfaces/customs/auth/Auth'

export const useUsers = () => {
  const findUserByName = async (name: string): Promise<IUser | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .eq('name', name)
        .maybeSingle()

      if (error || !data) return null

      return data
    } catch {
      return null
    }
  }

  return { findUserByName }
}
