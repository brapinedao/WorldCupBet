<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-6">
    <h1 class="text-2xl font-bold">Pronósticos de Todos</h1>

    <p v-if="isLoading" class="text-center text-white/60">Cargando pronósticos...</p>

    <template v-else-if="nextMatch">
      <GlassCard class="p-6">
        <MatchCard
          :home-team="nextMatch.home_team"
          :away-team="nextMatch.away_team"
          :match-date="nextMatch.match_date"
          :venue="nextMatch.venue"
        />
      </GlassCard>

      <BaseInput
        v-if="hasPredictions"
        v-model="searchQuery"
        placeholder="Buscar usuario"
        class="w-full"
      />

      <GlassCard v-if="predictions.length > 0" class="flex flex-col">
        <div
          v-for="prediction in predictions"
          :key="prediction.user.display_name"
          class="flex items-center justify-between gap-4 border-t border-white/5 px-4 py-3 first:border-t-0"
        >
          <span class="text-sm text-white/80">{{ prediction.user.display_name }}</span>
          <span class="text-sm font-bold text-white">
            {{ prediction.predicted_home_score }} - {{ prediction.predicted_away_score }}
          </span>
        </div>
      </GlassCard>

      <p v-else-if="hasPredictions" class="text-center text-white/60">
        No se encontraron usuarios con ese nombre.
      </p>

      <p v-else class="text-center text-white/60">
        Todavía nadie ha guardado un pronóstico para este partido.
      </p>
    </template>

    <p v-else class="text-center text-white/60">No hay próximos partidos programados.</p>
  </div>
</template>

<script setup lang="ts">
import BaseInput from '@/components/ui/BaseInput.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import MatchCard from '@/components/ui/MatchCard.vue'

import useAllPredictionsView from './AllPredictions'

const { nextMatch, predictions, hasPredictions, searchQuery, isLoading } = useAllPredictionsView()
</script>
