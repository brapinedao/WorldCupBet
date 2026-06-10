import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useRankingsStore } from '@/stores/rankings/rankings'

const useRankingsView = () => {
  const rankingsStore = useRankingsStore()
  const { rankings } = storeToRefs(rankingsStore)
  const { _getListRankings } = rankingsStore

  const isLoading = ref(true)
  const searchQuery = ref('')

  const rankingsWithPosition = computed(() =>
    rankings.value.map((ranking, index) => ({ ...ranking, position: index + 1 })),
  )

  const podium = computed(() => rankingsWithPosition.value.slice(0, 3))

  const filteredRankings = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    if (!query) return rankingsWithPosition.value.slice(3)

    return rankingsWithPosition.value.filter((ranking) =>
      ranking.display_name.toLowerCase().includes(query),
    )
  })

  onMounted(async () => {
    await _getListRankings()
    isLoading.value = false
  })

  return {
    podium,
    filteredRankings,
    searchQuery,
    isLoading,
  }
}

export default useRankingsView
