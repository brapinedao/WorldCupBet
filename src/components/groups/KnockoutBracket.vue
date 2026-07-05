<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold text-white/80">Llaves de Eliminación Directa</h2>

    <div class="overflow-x-auto pb-2">
      <div class="flex gap-6" style="min-width: max-content">
        <div v-for="round in rounds" :key="round.label" class="flex w-44 shrink-0 flex-col gap-3">
          <h3 class="text-center text-xs font-semibold uppercase tracking-wider text-white/50">
            {{ round.label }}
          </h3>

          <div class="flex flex-1 flex-col justify-around gap-3">
            <GlassCard
              v-for="(slot, index) in round.slots"
              :key="index"
              class="flex flex-col gap-1.5 p-2.5"
            >
              <div
                v-if="slot.scheduledAt"
                class="mb-0.5 flex items-center justify-between text-[10px] text-white/40"
              >
                <span>{{ formatSlotDate(slot.scheduledAt) }}</span>
                <span v-if="slot.isFinished" class="rounded bg-white/10 px-1 text-emerald-400">
                  Fin
                </span>
              </div>

              <div
                v-for="(team, teamIndex) in [slot.home, slot.away]"
                :key="teamIndex"
                class="flex items-center gap-2 rounded-lg px-1.5 py-1"
                :class="team.isWinner ? 'bg-gold-cta/10' : ''"
              >
                <img
                  v-if="team.flagUrl"
                  :src="team.flagUrl"
                  :alt="team.name"
                  class="h-5 w-5 shrink-0 rounded-full object-cover ring-1 ring-white/10"
                />
                <span
                  v-else
                  class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/40"
                >
                  ?
                </span>
                <span
                  class="flex-1 truncate text-xs"
                  :class="
                    team.isWinner
                      ? 'font-semibold text-gold-400'
                      : team.name === 'A definir'
                        ? 'text-white/30'
                        : 'text-white/70'
                  "
                >
                  {{ team.name }}
                </span>
                <span v-if="team.score !== null" class="text-xs font-bold text-white/70">
                  {{ team.score }}
                </span>
              </div>
            </GlassCard>
          </div>
        </div>

        <div class="flex w-44 shrink-0 flex-col items-center justify-center gap-3">
          <span class="animate-float text-4xl" aria-hidden="true">🏆</span>
          <GlassCard class="w-full p-4 text-center text-sm text-white/30">?</GlassCard>
        </div>
      </div>
    </div>

    <GlassCard class="mx-auto w-full max-w-xs p-3 text-center">
      <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
        Tercer Puesto
      </h3>
      <div class="flex items-center justify-center gap-2 text-xs text-white/30">
        <span>?</span>
        <span>vs</span>
        <span>?</span>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import GlassCard from '@/components/ui/GlassCard.vue'
import type { IMatch } from '@/interfaces/customs/matches/Matches'

interface ISlotTeam {
  name: string
  flagUrl: string | null
  score: number | null
  isWinner: boolean
}

interface IBracketSlot {
  home: ISlotTeam
  away: ISlotTeam
  scheduledAt?: string
  isFinished?: boolean
}

interface IBracketRound {
  label: string
  slots: IBracketSlot[]
}

interface IBracketPairConfig {
  feederA: [string, string]
  feederB: [string, string]
  scheduledAt?: string
}

const props = defineProps<{
  matches: IMatch[]
  octavosMatches: IMatch[]
}>()

// Cruces oficiales de octavos (llave fija del torneo, no se puede derivar por fecha ni por id):
// cada slot combina los ganadores de dos partidos de dieciseisavos específicos (identificados
// por el par de códigos de equipo de cada partido, sin importar el orden local/visitante).
// scheduledAt es la fecha/hora real ya confirmada para ese cruce (hora Colombia -> UTC +5h),
// independiente de si los equipos ya están definidos.
const OCTAVOS_STRUCTURE: IBracketPairConfig[] = [
  { feederA: ['RSA', 'CAN'], feederB: ['NED', 'MAR'], scheduledAt: '2026-07-04T17:00:00+00:00' },
  { feederA: ['GER', 'PAR'], feederB: ['FRA', 'SWE'], scheduledAt: '2026-07-04T21:00:00+00:00' },
  { feederA: ['BEL', 'SEN'], feederB: ['USA', 'BIH'], scheduledAt: '2026-07-07T00:00:00+00:00' },
  { feederA: ['ESP', 'AUT'], feederB: ['POR', 'CRO'], scheduledAt: '2026-07-06T19:00:00+00:00' },
  { feederA: ['BRA', 'JPN'], feederB: ['CIV', 'NOR'], scheduledAt: '2026-07-05T20:00:00+00:00' },
  { feederA: ['MEX', 'ECU'], feederB: ['ENG', 'COD'], scheduledAt: '2026-07-06T00:00:00+00:00' },
  { feederA: ['SUI', 'ALG'], feederB: ['COL', 'GHA'], scheduledAt: '2026-07-07T20:00:00+00:00' },
  { feederA: ['AUS', 'EGY'], feederB: ['ARG', 'CPV'], scheduledAt: '2026-07-07T16:00:00+00:00' },
]

// Cruces oficiales de cuartos: cada slot combina los ganadores de dos partidos de octavos
// específicos, agrupando de a dos las 8 entradas de OCTAVOS_STRUCTURE en su mismo orden (así
// se derivó: Marruecos y Francia, ambos ganadores de sus octavos, quedaron emparejados en el
// primer cruce de cuartos). Todavía no hay horario oficial confirmado para esta ronda.
const CUARTOS_STRUCTURE: IBracketPairConfig[] = [
  { feederA: ['CAN', 'MAR'], feederB: ['PAR', 'FRA'] },
  { feederA: ['BEL', 'USA'], feederB: ['ESP', 'POR'] },
  { feederA: ['BRA', 'NOR'], feederB: ['MEX', 'ENG'] },
  { feederA: ['SUI', 'COL'], feederB: ['ARG', 'EGY'] },
]

const findMatchByTeamCodes = (matches: IMatch[], codes: [string, string]): IMatch | undefined =>
  matches.find(
    (match) =>
      (match.home_team.code === codes[0] && match.away_team.code === codes[1]) ||
      (match.home_team.code === codes[1] && match.away_team.code === codes[0]),
  )

const resolveAdvancingTeam = (match: IMatch | undefined): ISlotTeam => {
  if (!match || match.status !== 'finished' || match.winner_team_id === null) {
    return { name: 'A definir', flagUrl: null, score: null, isWinner: false }
  }

  const winner = match.winner_team_id === match.home_team.id ? match.home_team : match.away_team
  return { name: winner.name, flagUrl: winner.flag_url, score: null, isWinner: false }
}

const buildPlaceholderRound = (label: string, slotCount: number): IBracketRound => ({
  label,
  slots: Array.from({ length: slotCount }, () => ({
    home: { name: 'A definir', flagUrl: null, score: null, isWinner: false },
    away: { name: 'A definir', flagUrl: null, score: null, isWinner: false },
  })),
})

// Ordena los 16 partidos según la llave oficial (feederA seguido de feederB de cada cruce de
// octavos), no por match_date, para que las cajas emparejadas queden visualmente adyacentes.
const firstRound = computed<IBracketRound>(() => ({
  label: 'Dieciseisavos',
  slots: OCTAVOS_STRUCTURE.flatMap((pair) => [pair.feederA, pair.feederB])
    .map((codes) => findMatchByTeamCodes(props.matches, codes))
    .filter((match): match is IMatch => !!match)
    .map((match) => ({
      home: {
        name: match.home_team.name,
        flagUrl: match.home_team.flag_url,
        score: match.status === 'finished' ? match.home_score : null,
        isWinner: match.status === 'finished' && match.winner_team_id === match.home_team.id,
      },
      away: {
        name: match.away_team.name,
        flagUrl: match.away_team.flag_url,
        score: match.status === 'finished' ? match.away_score : null,
        isWinner: match.status === 'finished' && match.winner_team_id === match.away_team.id,
      },
      scheduledAt: match.match_date,
      isFinished: match.status === 'finished',
    })),
}))

// Los ganadores de dieciseisavos se van colocando en su cruce de octavos correspondiente a
// medida que se conocen (resolveAdvancingTeam devuelve "A definir" mientras el partido no
// termine).
const secondRound = computed<IBracketRound>(() => ({
  label: 'Octavos',
  slots: OCTAVOS_STRUCTURE.map((pair) => ({
    home: resolveAdvancingTeam(findMatchByTeamCodes(props.matches, pair.feederA)),
    away: resolveAdvancingTeam(findMatchByTeamCodes(props.matches, pair.feederB)),
    scheduledAt: pair.scheduledAt,
  })),
}))

// Igual que Octavos pero un nivel arriba: los ganadores de octavos (props.octavosMatches) se
// van colocando en su cruce de cuartos correspondiente. Semifinal/Final siguen sin llave
// definida — placeholders sin datos.
const thirdRound = computed<IBracketRound>(() => ({
  label: 'Cuartos',
  slots: CUARTOS_STRUCTURE.map((pair) => ({
    home: resolveAdvancingTeam(findMatchByTeamCodes(props.octavosMatches, pair.feederA)),
    away: resolveAdvancingTeam(findMatchByTeamCodes(props.octavosMatches, pair.feederB)),
    scheduledAt: pair.scheduledAt,
  })),
}))

const rounds = computed<IBracketRound[]>(() => [
  firstRound.value,
  secondRound.value,
  thirdRound.value,
  buildPlaceholderRound('Semifinal', 2),
  buildPlaceholderRound('Final', 1),
])

const formatSlotDate = (isoDate: string): string =>
  new Date(isoDate).toLocaleString('es-CO', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
</script>
