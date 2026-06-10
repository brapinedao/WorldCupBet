<template>
  <GlassCard class="relative flex flex-col gap-4 p-4" :class="{ 'opacity-60': hasResult }">
    <span
      v-if="pointsBadge !== null"
      class="absolute -right-2 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-xs font-bold shadow-lg"
      :class="
        hasResult ? 'bg-gold-cta text-navy-950' : 'bg-white/15 text-white/70 ring-1 ring-white/20'
      "
    >
      +{{ pointsBadge }}
    </span>

    <div class="flex items-center justify-between text-xs text-white/50">
      <span>{{ formattedDate }}</span>
      <span v-if="match.venue">{{ match.venue }}</span>
    </div>

    <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <TeamBadge :name="match.home_team.name" :flag-url="match.home_team.flag_url" />

      <div class="flex flex-col items-center gap-2">
        <div v-if="hasResult" class="flex items-center gap-2">
          <span class="text-lg font-bold text-white">{{ match.home_score }}</span>
          <span class="text-white/40">-</span>
          <span class="text-lg font-bold text-white">{{ match.away_score }}</span>
        </div>

        <div v-else-if="isLocked" class="flex items-center gap-2 text-white/60">
          <span class="text-lg font-bold">{{ prediction?.predicted_home_score ?? '-' }}</span>
          <span class="text-white/40">-</span>
          <span class="text-lg font-bold">{{ prediction?.predicted_away_score ?? '-' }}</span>
        </div>

        <div v-else class="flex items-center gap-2">
          <BaseInput
            :id="`home-score-${match.id}`"
            v-model="homeScoreInput"
            type="number"
            min="0"
            max="20"
            class="w-16 text-center"
          />
          <span class="text-white/40">-</span>
          <BaseInput
            :id="`away-score-${match.id}`"
            v-model="awayScoreInput"
            type="number"
            min="0"
            max="20"
            class="w-16 text-center"
          />
        </div>

        <span v-if="hasResult && hasPrediction" class="text-[11px] text-white/40">
          Tu pronóstico: {{ prediction!.predicted_home_score }} -
          {{ prediction!.predicted_away_score }}
        </span>
      </div>

      <TeamBadge :name="match.away_team.name" :flag-url="match.away_team.flag_url" />
    </div>

    <template v-if="!isLocked">
      <BaseButton variant="glass" :loading="isSaving" :disabled="!canSave" @click="handleSave">
        Guardar pronóstico
      </BaseButton>
      <p v-if="hasInvalidInput" class="text-center text-[11px] text-red-400">
        El marcador debe ser un número entre 0 y 20
      </p>
      <p v-else-if="saveError" class="text-center text-[11px] text-red-400">{{ saveError }}</p>
    </template>
    <p v-else-if="!hasPrediction" class="text-center text-xs text-white/50">Sin pronóstico</p>
  </GlassCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import TeamBadge from '@/components/ui/TeamBadge.vue'
import type { IMatch } from '@/interfaces/customs/matches/Matches'
import type { IPrediction } from '@/interfaces/customs/predictions/Predictions'

const props = defineProps<{
  match: IMatch
  prediction?: IPrediction
  isSaving: boolean
  saveError?: string | null
}>()

const emit = defineEmits<{
  save: [payload: { matchId: number; homeScore: number; awayScore: number }]
}>()

const homeScoreInput = ref(props.prediction?.predicted_home_score?.toString() ?? '')
const awayScoreInput = ref(props.prediction?.predicted_away_score?.toString() ?? '')

const LOCK_BEFORE_KICKOFF_MS = 60 * 60 * 1000

const hasResult = computed(() => props.match.status === 'finished')

const isLocked = computed(
  () =>
    hasResult.value ||
    Date.now() >= new Date(props.match.match_date).getTime() - LOCK_BEFORE_KICKOFF_MS,
)

const hasPrediction = computed(() => !!props.prediction)

const pointsBadge = computed((): number | null => {
  if (hasResult.value) {
    return hasPrediction.value ? (props.prediction?.points ?? null) : null
  }

  return hasPrediction.value ? 1 : null
})

const SCORE_MIN = 0
const SCORE_MAX = 20

const isValidScore = (value: string): boolean => {
  if (value.trim() === '') return false
  const score = Number(value)
  return Number.isInteger(score) && score >= SCORE_MIN && score <= SCORE_MAX
}

const isEmptyOrValidScore = (value: string): boolean => value.trim() === '' || isValidScore(value)

const canSave = computed(
  () => isValidScore(homeScoreInput.value) && isValidScore(awayScoreInput.value),
)

const hasInvalidInput = computed(
  () => !isEmptyOrValidScore(homeScoreInput.value) || !isEmptyOrValidScore(awayScoreInput.value),
)

const formattedDate = computed(() =>
  new Date(props.match.match_date).toLocaleString('es-CO', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }),
)

const handleSave = (): void => {
  if (!canSave.value) return

  const homeScore = Number(homeScoreInput.value)
  const awayScore = Number(awayScoreInput.value)

  emit('save', { matchId: props.match.id, homeScore, awayScore })
}
</script>
