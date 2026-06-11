import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useMatchesStore } from '@/stores/matches/matches'
import type { IMatch } from '@/interfaces/customs/matches/Matches'

const SCORE_MIN = 0
const SCORE_MAX = 20

const isValidScore = (value: string): boolean => {
  if (value.trim() === '') return false
  const score = Number(value)
  return Number.isInteger(score) && score >= SCORE_MIN && score <= SCORE_MAX
}

const isEmptyOrValidScore = (value: string): boolean => value.trim() === '' || isValidScore(value)

const formatMatchDate = (isoDate: string): string =>
  new Date(isoDate).toLocaleString('es-CO', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

const useMatchResultsView = () => {
  const matchesStore = useMatchesStore()
  const { matches } = storeToRefs(matchesStore)
  const { _getListMatches, _updateMatchResult } = matchesStore

  const isLoading = ref(true)
  const isSaving = ref(false)
  const saveError = ref<string | null>(null)
  const saveSuccess = ref(false)

  const selectedMatchId = ref('')
  const homeScoreInput = ref('')
  const awayScoreInput = ref('')

  const pendingMatches = computed(() =>
    matches.value.filter(
      (match) => match.status === 'scheduled' && new Date(match.match_date).getTime() <= Date.now(),
    ),
  )

  const matchOptions = computed(() =>
    pendingMatches.value.map((match) => ({
      value: String(match.id),
      label: `${match.home_team.name} vs ${match.away_team.name} — ${formatMatchDate(match.match_date)}`,
    })),
  )

  const selectedMatch = computed<IMatch | null>(
    () =>
      pendingMatches.value.find((match) => String(match.id) === selectedMatchId.value) ?? null,
  )

  const canSave = computed(
    () =>
      !!selectedMatch.value &&
      isValidScore(homeScoreInput.value) &&
      isValidScore(awayScoreInput.value),
  )

  const hasInvalidInput = computed(
    () => !isEmptyOrValidScore(homeScoreInput.value) || !isEmptyOrValidScore(awayScoreInput.value),
  )

  watch(selectedMatchId, () => {
    homeScoreInput.value = ''
    awayScoreInput.value = ''
  })

  const handleSave = async (): Promise<void> => {
    if (!canSave.value || !selectedMatch.value) return

    saveError.value = null
    saveSuccess.value = false
    isSaving.value = true

    const homeScore = Number(homeScoreInput.value)
    const awayScore = Number(awayScoreInput.value)

    let winnerTeamId: number | null = null
    if (homeScore > awayScore) winnerTeamId = selectedMatch.value.home_team.id
    else if (awayScore > homeScore) winnerTeamId = selectedMatch.value.away_team.id

    const success = await _updateMatchResult({
      matchId: selectedMatch.value.id,
      homeScore,
      awayScore,
      winnerTeamId,
    })

    if (success) {
      saveSuccess.value = true
      selectedMatchId.value = pendingMatches.value[0] ? String(pendingMatches.value[0].id) : ''
    } else {
      saveError.value = 'No se pudo guardar el resultado. Intenta de nuevo.'
    }

    isSaving.value = false
  }

  onMounted(async () => {
    await _getListMatches()
    selectedMatchId.value = pendingMatches.value[0] ? String(pendingMatches.value[0].id) : ''
    isLoading.value = false
  })

  return {
    isLoading,
    isSaving,
    saveError,
    saveSuccess,
    pendingMatches,
    matchOptions,
    selectedMatchId,
    selectedMatch,
    homeScoreInput,
    awayScoreInput,
    canSave,
    hasInvalidInput,
    handleSave,
  }
}

export default useMatchResultsView
