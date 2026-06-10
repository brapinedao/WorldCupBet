export interface ITeam {
  id: number
  name: string
  code: string
  flag_url: string | null
}

export interface IMatch {
  id: number
  match_date: string
  stage: string
  status: string
  group_name: string | null
  match_number: number | null
  venue: string | null
  home_score: number | null
  away_score: number | null
  home_team: ITeam
  away_team: ITeam
}
