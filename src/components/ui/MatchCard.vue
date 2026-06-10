<template>
  <div>
    <div class="flex items-center justify-between gap-3">
      <TeamBadge :name="homeTeam.name" :flag-url="homeTeam.flag_url" />
      <span class="text-sm font-semibold text-white/40">VS</span>
      <TeamBadge :name="awayTeam.name" :flag-url="awayTeam.flag_url" />
    </div>
    <p class="mt-3 text-center text-xs text-white/50">{{ formattedDate }}</p>
    <p v-if="venue" class="text-center text-xs text-white/50">{{ venue }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import TeamBadge from './TeamBadge.vue'
import type { ITeam } from '@/interfaces/customs/matches/Matches'

const props = defineProps<{
  homeTeam: ITeam
  awayTeam: ITeam
  matchDate: string
  venue?: string | null
}>()

const formattedDate = computed(() =>
  new Date(props.matchDate).toLocaleString('es-CO', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }),
)
</script>
