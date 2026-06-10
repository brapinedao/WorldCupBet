import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth/auth'
import { useMatchesStore } from '@/stores/matches/matches'
import { NEWS_ITEMS } from '@/constants/worldCup'

const useLogin = () => {
  const router = useRouter()
  const authStore = useAuthStore()
  const matchesStore = useMatchesStore()

  const { _setUser, _getUserByUsername } = authStore
  const { _getListMatches } = matchesStore
  const { matches } = storeToRefs(matchesStore)

  const username = ref('')
  const error = ref('')
  const isSubmitting = ref(false)

  const upcomingMatches = computed(() =>
    matches.value.filter((match) => match.status !== 'finished').slice(0, 2),
  )

  const handleLogin = async (): Promise<void> => {
    const trimmedUsername = username.value.trim()

    if (!trimmedUsername) {
      error.value = 'Ingrese un usuario'
      return
    }

    error.value = ''
    isSubmitting.value = true

    const user = await _getUserByUsername(trimmedUsername)

    isSubmitting.value = false

    if (!user) {
      error.value = 'Usuario no encontrado'
      return
    }

    _setUser(user)
    router.push({ name: 'Predictions' })
  }

  onMounted(() => {
    _getListMatches()
  })

  return {
    username,
    error,
    isSubmitting,
    handleLogin,
    upcomingMatches,
    newsItems: NEWS_ITEMS,
  }
}

export default useLogin
