<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Pronósticos de Todos</h1>
      <BaseButton :loading="isGeneratingAudit" @click="handleAuditDownload">Auditoría</BaseButton>
    </div>

    <p v-if="isLoading" class="text-center text-white/60">Cargando pronósticos...</p>

    <template v-else-if="selectedMatch">
      <div v-if="nextMatches.length > 1" class="flex gap-2 overflow-x-auto">
        <button
          v-for="match in nextMatches"
          :key="match.id"
          type="button"
          class="whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition"
          :class="
            selectedMatchId === match.id
              ? 'bg-gold-cta text-navy-950'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          "
          @click="handleSelectMatch(match.id)"
        >
          {{ match.home_team.code }} vs {{ match.away_team.code }}
        </button>
      </div>

      <GlassCard class="p-6">
        <MatchCard
          :home-team="selectedMatch.home_team"
          :away-team="selectedMatch.away_team"
          :match-date="selectedMatch.match_date"
          :venue="selectedMatch.venue"
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
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import MatchCard from '@/components/ui/MatchCard.vue'

import useAllPredictionsView from './AllPredictions'

const {
  nextMatches,
  selectedMatch,
  selectedMatchId,
  handleSelectMatch,
  predictions,
  hasPredictions,
  searchQuery,
  isLoading,
  isGeneratingAudit,
  handleAuditDownload,
} = useAllPredictionsView()
</script>
