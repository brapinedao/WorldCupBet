<template>
  <div class="mx-auto flex max-w-xl flex-col gap-6">
    <h1 class="text-2xl font-bold">Actualizar Resultados</h1>

    <p v-if="isLoading" class="text-center text-white/60">Cargando partidos...</p>

    <p v-else-if="pendingMatches.length === 0" class="text-center text-white/60">
      No hay partidos pendientes de resultado.
    </p>

    <GlassCard v-else class="flex flex-col gap-4 p-6">
      <BaseSelect v-model="selectedMatchId" label="Partido" :options="matchOptions" />

      <div v-if="selectedMatch" class="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <BaseInput
          v-model="homeScoreInput"
          :label="selectedMatch.home_team.name"
          type="number"
          min="0"
          max="20"
          class="text-center"
        />
        <span class="pb-3 text-white/40">-</span>
        <BaseInput
          v-model="awayScoreInput"
          :label="selectedMatch.away_team.name"
          type="number"
          min="0"
          max="20"
          class="text-center"
        />
      </div>

      <BaseButton :loading="isSaving" :disabled="!canSave" @click="handleSave">
        Guardar resultado
      </BaseButton>

      <p v-if="hasInvalidInput" class="text-center text-sm text-red-400">
        El marcador debe ser un número entre 0 y 20
      </p>
      <p v-else-if="saveError" class="text-center text-sm text-red-400">{{ saveError }}</p>
      <p v-else-if="saveSuccess" class="text-center text-sm text-emerald-400">
        Resultado guardado correctamente.
      </p>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import GlassCard from '@/components/ui/GlassCard.vue'

import useMatchResultsView from './MatchResults'

const {
  isLoading,
  isSaving,
  saveError,
  saveSuccess,
  pendingMatches,
  matchOptions,
  selectedMatchId,
  selectedMatch,
  homeScoreInput,
  awayScoreInput,
  canSave,
  hasInvalidInput,
  handleSave,
} = useMatchResultsView()
</script>
