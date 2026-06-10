import { defineStore } from 'pinia'

import { useRankings } from '@/composables/useRankings'
import type { IUserRanking } from '@/interfaces/customs/rankings/Rankings'

interface IRankingsState {
  rankings: IUserRanking[]
}

export const useRankingsStore = defineStore('rankings', {
  state: (): IRankingsState => ({
    rankings: [],
  }),
  actions: {
    async _getListRankings(): Promise<boolean> {
      const { fetchUserRankings } = useRankings()
      this.rankings = await fetchUserRankings()
      return this.rankings.length > 0
    },
  },
})
