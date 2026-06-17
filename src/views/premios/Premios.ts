import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface IPrize {
  place: 1 | 2 | 3
  medal: string
  badgeLabel: string
  title: string
  perks: string[]
  revealAt: Date | null
  revealLabel: string | null
}

interface IStat {
  value: string
  label: string
}

const SECOND_PLACE_REVEAL_AT = new Date('2026-06-28T00:00:00')
const FIRST_PLACE_REVEAL_AT = new Date('2026-07-14T00:00:00')

// Orden de presentación en el podio (2°, 1°, 3°), no orden de puesto.
const PRIZES: IPrize[] = [
  {
    place: 2,
    medal: '🥈',
    badgeLabel: '2° LUGAR',
    title: 'El Subcampeón',
    perks: ['El premio que el 1° no escoja 💪'],
    revealAt: SECOND_PLACE_REVEAL_AT,
    revealLabel: '28 de junio',
  },
  {
    place: 1,
    medal: '🥇',
    badgeLabel: '1ER LUGAR',
    title: 'El Gran Campeón',
    perks: ['🌴 3 días de vacaciones', '🍷 $100 USD para cenar'],
    revealAt: FIRST_PLACE_REVEAL_AT,
    revealLabel: '14 de julio',
  },
  {
    place: 3,
    medal: '🥉',
    badgeLabel: '3ER LUGAR',
    title: 'El Guerrero',
    perks: ['1 día de vacaciones 🌍'],
    revealAt: null,
    revealLabel: null,
  },
]

const STATS: IStat[] = [
  { value: '$100', label: 'USD' },
  { value: '4', label: 'días libres' },
  { value: '3', label: 'ganadores' },
]

const usePremios = () => {
  const router = useRouter()
  const now = Date.now()

  const prizes = computed(() =>
    PRIZES.map((prize) => ({
      ...prize,
      isRevealed: !prize.revealAt || now >= prize.revealAt.getTime(),
    })),
  )

  const isFirstPlaceRevealed = now >= FIRST_PLACE_REVEAL_AT.getTime()

  const handleGoToPredictions = (): void => {
    router.push({ name: 'Predictions' })
  }

  return {
    prizes,
    stats: STATS,
    isFirstPlaceRevealed,
    handleGoToPredictions,
  }
}

export default usePremios
