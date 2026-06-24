import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useMatchesStore } from '@/stores/matches/matches'
import { usePredictionsStore } from '@/stores/predictions/predictions'
import type { IMatch } from '@/interfaces/customs/matches/Matches'
import type { IAuditMatch } from '@/interfaces/customs/predictions/Predictions'

const formatMatchDate = (iso: string): string =>
  new Date(iso).toLocaleString('es-CO', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

const formatUpdatedAt = (iso: string | null): string => {
  if (!iso) return '—'
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const sanitizeSheetName = (name: string): string => name.replace(/[\\/*[\]:?]/g, '').slice(0, 31)

const buildAuditWorkbook = async (finishedMatches: IAuditMatch[]) => {
  const XLSX = await import('xlsx')

  const userMap = new Map<
    string,
    {
      match: IAuditMatch
      predicted_home: number
      predicted_away: number
      points: number | null
      updated_at: string | null
    }[]
  >()

  for (const match of finishedMatches) {
    for (const pred of match.predictions) {
      const name = pred.user.display_name
      if (!userMap.has(name)) userMap.set(name, [])
      userMap.get(name)!.push({
        match,
        predicted_home: pred.predicted_home_score,
        predicted_away: pred.predicted_away_score,
        points: pred.points,
        updated_at: pred.updated_at,
      })
    }
  }

  const wb = XLSX.utils.book_new()
  const sortedUsers = [...userMap.keys()].sort((a, b) => a.localeCompare(b))

  for (const user of sortedUsers) {
    const rows = userMap.get(user)!
    const totalPoints = rows.reduce((sum, r) => sum + (r.points ?? 0), 0)

    const wsData: (string | number)[][] = [
      ['Partido', 'Fecha', 'Mi pronóstico', 'Resultado real', 'Puntos', 'Actualización'],
      ...rows.map((r) => [
        `${r.match.home_team.name} vs ${r.match.away_team.name}`,
        formatMatchDate(r.match.match_date),
        `${r.predicted_home} - ${r.predicted_away}`,
        `${r.match.home_score} - ${r.match.away_score}`,
        r.points ?? 0,
        formatUpdatedAt(r.updated_at),
      ]),
      ['', '', '', 'TOTAL', totalPoints, ''],
    ]

    const ws = XLSX.utils.aoa_to_sheet(wsData)
    ws['!cols'] = [{ wch: 28 }, { wch: 22 }, { wch: 16 }, { wch: 16 }, { wch: 8 }, { wch: 14 }]
    XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(user))
  }

  const today = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `auditoria_${today}.xlsx`)
}

const useAllPredictionsView = () => {
  const matchesStore = useMatchesStore()
  const predictionsStore = usePredictionsStore()

  const { matches } = storeToRefs(matchesStore)
  const { matchPredictions } = storeToRefs(predictionsStore)
  const { _getListMatches } = matchesStore
  const { _getMatchPredictions, _getAuditPredictions } = predictionsStore

  const isLoading = ref(true)
  const isGeneratingAudit = ref(false)
  const searchQuery = ref('')
  const selectedMatchId = ref<number | null>(null)

  // matches ya viene ordenado por match_date asc: el primer partido scheduled marca el
  // próximo horario, y puede haber varios partidos arrancando a esa misma hora.
  const nextMatches = computed<IMatch[]>(() => {
    const next = matches.value.find((match) => match.status === 'scheduled')
    if (!next) return []

    return matches.value.filter(
      (match) => match.status === 'scheduled' && match.match_date === next.match_date,
    )
  })

  const selectedMatch = computed<IMatch | null>(
    () => nextMatches.value.find((match) => match.id === selectedMatchId.value) ?? null,
  )

  const sortedPredictions = computed(() =>
    [...matchPredictions.value].sort((a, b) =>
      a.user.display_name.localeCompare(b.user.display_name),
    ),
  )

  const hasPredictions = computed(() => matchPredictions.value.length > 0)

  const filteredPredictions = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    if (!query) return sortedPredictions.value

    return sortedPredictions.value.filter((prediction) =>
      prediction.user.display_name.toLowerCase().includes(query),
    )
  })

  const handleSelectMatch = async (matchId: number): Promise<void> => {
    selectedMatchId.value = matchId
    searchQuery.value = ''
    await _getMatchPredictions(matchId)
  }

  const handleAuditDownload = async (): Promise<void> => {
    isGeneratingAudit.value = true
    const finishedMatches = await _getAuditPredictions()
    await buildAuditWorkbook(finishedMatches)
    isGeneratingAudit.value = false
  }

  onMounted(async () => {
    await _getListMatches()

    const firstMatch = nextMatches.value[0]
    if (firstMatch) {
      await handleSelectMatch(firstMatch.id)
    }

    isLoading.value = false
  })

  return {
    nextMatches,
    selectedMatch,
    selectedMatchId,
    handleSelectMatch,
    predictions: filteredPredictions,
    hasPredictions,
    searchQuery,
    isLoading,
    isGeneratingAudit,
    handleAuditDownload,
  }
}

export default useAllPredictionsView
