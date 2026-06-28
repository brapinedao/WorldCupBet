import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useRankingsStore } from '@/stores/rankings/rankings'

const POINTS_RULES = [
  { points: 5, description: 'Aciertas el marcador exacto del partido.' },
  {
    points: 3,
    description:
      'Aciertas el resultado (gana el local, empate o gana el visitante) sin el marcador exacto.',
  },
  { points: 1, description: 'Tu pronóstico no acierta el resultado del partido.' },
  { points: 0, description: 'No guardaste un pronóstico para ese partido.' },
  {
    points: 2,
    description:
      'Bonus en fases de eliminación directa: aciertas qué equipo avanza, sumado a los puntos anteriores (incluso si el marcador termina en empate y se define por penales).',
  },
] as const

const useRankingsView = () => {
  const rankingsStore = useRankingsStore()
  const { rankings } = storeToRefs(rankingsStore)
  const { _getListRankings } = rankingsStore

  const isLoading = ref(true)
  const searchQuery = ref('')
  const isRulesModalOpen = ref(false)

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
    isRulesModalOpen,
    pointsRules: POINTS_RULES,
  }
}

export default useRankingsView
