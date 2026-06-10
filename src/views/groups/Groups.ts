import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useMatchesStore } from '@/stores/matches/matches'
import { useTeamsStore } from '@/stores/teams/teams'
import type { IMatch } from '@/interfaces/customs/matches/Matches'
import type { IGroupTeam, ITeamStanding } from '@/interfaces/customs/teams/Teams'

const buildStandings = (teams: IGroupTeam[], matches: IMatch[]): ITeamStanding[] => {
  const standingByTeamId = new Map<number, ITeamStanding>()

  teams.forEach((team) => {
    standingByTeamId.set(team.id, {
      ...team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    })
  })

  matches
    .filter((match) => match.status === 'finished')
    .forEach((match) => {
      const home = standingByTeamId.get(match.home_team.id)
      const away = standingByTeamId.get(match.away_team.id)
      if (!home || !away) return

      const homeScore = match.home_score ?? 0
      const awayScore = match.away_score ?? 0

      home.played += 1
      away.played += 1
      home.goalsFor += homeScore
      home.goalsAgainst += awayScore
      away.goalsFor += awayScore
      away.goalsAgainst += homeScore

      if (homeScore > awayScore) {
        home.won += 1
        home.points += 3
        away.lost += 1
      } else if (homeScore < awayScore) {
        away.won += 1
        away.points += 3
        home.lost += 1
      } else {
        home.drawn += 1
        away.drawn += 1
        home.points += 1
        away.points += 1
      }
    })

  standingByTeamId.forEach((standing) => {
    standing.goalDifference = standing.goalsFor - standing.goalsAgainst
  })

  return [...standingByTeamId.values()].sort(
    (a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor,
  )
}

const useGroupsView = () => {
  const teamsStore = useTeamsStore()
  const matchesStore = useMatchesStore()

  const { teams } = storeToRefs(teamsStore)
  const { matches } = storeToRefs(matchesStore)
  const { _getListTeams } = teamsStore
  const { _getListMatches } = matchesStore

  const isLoading = ref(true)

  const groupNames = computed(() => {
    const names = new Set(teams.value.map((team) => team.group_name))
    return [...names].sort()
  })

  const standingsByGroup = computed(() => {
    const map = new Map<string, ITeamStanding[]>()

    groupNames.value.forEach((groupName) => {
      const groupTeams = teams.value.filter((team) => team.group_name === groupName)
      const groupMatches = matches.value.filter((match) => match.group_name === groupName)
      map.set(groupName, buildStandings(groupTeams, groupMatches))
    })

    return map
  })

  onMounted(async () => {
    await Promise.all([_getListTeams(), _getListMatches()])
    isLoading.value = false
  })

  return {
    groupNames,
    standingsByGroup,
    isLoading,
  }
}

export default useGroupsView
