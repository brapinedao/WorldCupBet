import type { ITeam } from '@/interfaces/customs/matches/Matches'

export interface IGroupTeam extends ITeam {
  group_name: string
}

export interface ITeamStanding extends IGroupTeam {
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}
