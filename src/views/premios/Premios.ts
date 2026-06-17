import { useRouter } from 'vue-router'

interface IPrize {
  place: 1 | 2 | 3
  medal: string
  badgeLabel: string
  title: string
  perks: string[]
}

interface IStat {
  value: string
  label: string
}

// Orden de presentación en el podio (2°, 1°, 3°), no orden de puesto.
const PRIZES: IPrize[] = [
  {
    place: 2,
    medal: '🥈',
    badgeLabel: '2° LUGAR',
    title: 'El Subcampeón',
    perks: ['El premio que el 1° no escoja 💪'],
  },
  {
    place: 1,
    medal: '🥇',
    badgeLabel: '1ER LUGAR',
    title: 'El Gran Campeón',
    perks: ['🌴 3 días de vacaciones', '🍷 $100 USD para cenar'],
  },
  {
    place: 3,
    medal: '🥉',
    badgeLabel: '3ER LUGAR',
    title: 'El Guerrero',
    perks: ['1 día de vacaciones 🌍'],
  },
]

const STATS: IStat[] = [
  { value: '$100', label: 'USD' },
  { value: '4', label: 'días libres' },
  { value: '3', label: 'ganadores' },
]

const usePremios = () => {
  const router = useRouter()

  const handleGoToPredictions = (): void => {
    router.push({ name: 'Predictions' })
  }

  return {
    prizes: PRIZES,
    stats: STATS,
    handleGoToPredictions,
  }
}

export default usePremios
