<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-6">
    <h1 class="text-2xl font-bold">Mis Pronósticos</h1>

    <div class="flex flex-col gap-4 sm:flex-row">
      <BaseSelect v-model="predictionFilter" :options="PREDICTION_FILTER_OPTIONS" class="sm:w-48" />
      <BaseInput v-model="searchQuery" placeholder="Buscar por equipo" class="sm:flex-1" />
    </div>

    <p v-if="isLoading" class="text-center text-white/60">Cargando partidos...</p>

    <p v-else-if="matchSections.length === 0" class="text-center text-white/60">
      No se encontraron partidos con los filtros seleccionados.
    </p>

    <section
      v-for="section in matchSections"
      v-else
      :key="section.label"
      class="flex flex-col gap-4"
    >
      <h2 class="text-lg font-semibold text-white/80">{{ section.label }}</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PredictionMatchCard
          v-for="match in section.matches"
          :key="match.id"
          :match="match"
          :prediction="predictionByMatchId.get(match.id)"
          :is-saving="savingMatchId === match.id"
          :save-error="saveError?.matchId === match.id ? saveError.message : null"
          @save="handleSavePrediction"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import PredictionMatchCard from '@/components/predictions/PredictionMatchCard.vue'

import usePredictionsView, { PREDICTION_FILTER_OPTIONS } from './Predictions'

const {
  matchSections,
  predictionByMatchId,
  isLoading,
  savingMatchId,
  searchQuery,
  predictionFilter,
  saveError,
  handleSavePrediction,
} = usePredictionsView()
</script>
