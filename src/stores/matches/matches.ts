import { defineStore } from 'pinia'

import { useMatches } from '@/composables/useMatches'
import type { IMatch } from '@/interfaces/customs/matches/Matches'

interface IMatchesState {
  matches: IMatch[]
}

export const useMatchesStore = defineStore('matches', {
  state: (): IMatchesState => ({
    matches: [],
  }),
  actions: {
    async _getListMatches(): Promise<boolean> {
      const { fetchMatches } = useMatches()
      this.matches = await fetchMatches()
      return this.matches.length > 0
    },
  },
})
