import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useMatchesStore } from '@/stores/matches/matches'
import { usePredictionsStore } from '@/stores/predictions/predictions'
import type { IMatch } from '@/interfaces/customs/matches/Matches'

const useAllPredictionsView = () => {
  const matchesStore = useMatchesStore()
  const predictionsStore = usePredictionsStore()

  const { matches } = storeToRefs(matchesStore)
  const { matchPredictions } = storeToRefs(predictionsStore)
  const { _getListMatches } = matchesStore
  const { _getMatchPredictions } = predictionsStore

  const isLoading = ref(true)
  const searchQuery = ref('')

  const nextMatch = computed<IMatch | null>(
    () => matches.value.find((match) => match.status === 'scheduled') ?? null,
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

  onMounted(async () => {
    await _getListMatches()

    if (nextMatch.value) {
      await _getMatchPredictions(nextMatch.value.id)
    }

    isLoading.value = false
  })

  return {
    nextMatch,
    predictions: filteredPredictions,
    hasPredictions,
    searchQuery,
    isLoading,
  }
}

export default useAllPredictionsView
