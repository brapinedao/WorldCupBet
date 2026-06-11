import { defineStore } from 'pinia'

import { useMatches, type IUpdateMatchResultPayload } from '@/composables/useMatches'
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

    async _updateMatchResult(payload: IUpdateMatchResultPayload): Promise<boolean> {
      const { updateMatchResult } = useMatches()
      const success = await updateMatchResult(payload)

      if (success) {
        await this._getListMatches()
      }

      return success
    },
  },
})
