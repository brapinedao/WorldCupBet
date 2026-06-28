import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth/auth'
import { useMatchesStore } from '@/stores/matches/matches'
import { usePredictionsStore } from '@/stores/predictions/predictions'
import type { IMatch } from '@/interfaces/customs/matches/Matches'
import type { IPrediction } from '@/interfaces/customs/predictions/Predictions'

type PredictionFilter = 'all' | 'with' | 'without'

export const PREDICTION_FILTER_OPTIONS: { value: PredictionFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'with', label: 'Con pronóstico' },
  { value: 'without', label: 'Sin pronóstico' },
]

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000

const usePredictionsView = () => {
  const authStore = useAuthStore()
  const matchesStore = useMatchesStore()
  const predictionsStore = usePredictionsStore()

  const { id: userId } = storeToRefs(authStore)
  const { matches } = storeToRefs(matchesStore)
  const { predictions } = storeToRefs(predictionsStore)
  const { _getListMatches } = matchesStore
  const { _getListPredictions, _updatePrediction } = predictionsStore

  const isLoading = ref(true)
  const savingMatchId = ref<number | null>(null)
  const searchQuery = ref('')
  const predictionFilter = ref<PredictionFilter>('all')
  const saveError = ref<{ matchId: number; message: string } | null>(null)

  const predictionByMatchId = computed(() => {
    const map = new Map<number, IPrediction>()
    predictions.value.forEach((prediction) => map.set(prediction.match_id, prediction))
    return map
  })

  const filteredMatches = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    return matches.value.filter((match) => {
      const matchesSearch =
        !query ||
        [match.home_team.name, match.home_team.code, match.away_team.name, match.away_team.code]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const hasPrediction = predictionByMatchId.value.has(match.id)
      const matchesPredictionFilter =
        predictionFilter.value === 'all' ||
        (predictionFilter.value === 'with' && hasPrediction) ||
        (predictionFilter.value === 'without' && !hasPrediction)

      return matchesSearch && matchesPredictionFilter
    })
  })

  const matchSections = computed(() => {
    const now = Date.now()
    const upcoming: IMatch[] = []
    const regular: IMatch[] = []
    const finished: IMatch[] = []

    filteredMatches.value.forEach((match) => {
      if (match.status === 'finished') {
        finished.push(match)
        return
      }

      const kickoff = new Date(match.match_date).getTime()
      if (kickoff >= now && kickoff <= now + TWO_DAYS_MS) {
        upcoming.push(match)
      } else {
        regular.push(match)
      }
    })

    return [
      { label: 'Próximos partidos', matches: upcoming },
      { label: 'Más partidos', matches: regular },
      { label: 'Partidos finalizados', matches: finished },
    ].filter((section) => section.matches.length > 0)
  })

  const handleSavePrediction = async (payload: {
    matchId: number
    homeScore: number
    awayScore: number
    predictedWinnerTeamId: number | null
  }): Promise<void> => {
    if (!userId.value) return

    savingMatchId.value = payload.matchId
    saveError.value = null

    const success = await _updatePrediction({
      userId: userId.value,
      matchId: payload.matchId,
      predictedHomeScore: payload.homeScore,
      predictedAwayScore: payload.awayScore,
      predictedWinnerTeamId: payload.predictedWinnerTeamId,
    })

    if (!success) {
      saveError.value = {
        matchId: payload.matchId,
        message: 'No se pudo guardar el pronóstico. Es posible que el partido ya haya comenzado.',
      }
    }

    savingMatchId.value = null
  }

  onMounted(async () => {
    await Promise.all([
      _getListMatches(),
      userId.value ? _getListPredictions(userId.value) : Promise.resolve(false),
    ])
    isLoading.value = false
  })

  return {
    matchSections,
    predictionByMatchId,
    isLoading,
    savingMatchId,
    searchQuery,
    predictionFilter,
    saveError,
    handleSavePrediction,
  }
}

export default usePredictionsView
