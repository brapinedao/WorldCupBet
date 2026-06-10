import { defineStore } from 'pinia'

import { useTeams } from '@/composables/useTeams'
import type { IGroupTeam } from '@/interfaces/customs/teams/Teams'

interface ITeamsState {
  teams: IGroupTeam[]
}

export const useTeamsStore = defineStore('teams', {
  state: (): ITeamsState => ({
    teams: [],
  }),
  actions: {
    async _getListTeams(): Promise<boolean> {
      const { fetchTeams } = useTeams()
      this.teams = await fetchTeams()
      return this.teams.length > 0
    },
  },
})
