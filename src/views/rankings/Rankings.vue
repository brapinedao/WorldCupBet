<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold">Ranking</h1>

    <p v-if="isLoading" class="text-center text-white/60">Cargando ranking...</p>

    <template v-else-if="podium.length > 0">
      <div class="grid grid-cols-3 items-end gap-3 sm:gap-4">
        <GlassCard
          v-if="podium[1]"
          class="order-1 flex min-h-[160px] flex-col items-center justify-end gap-1 p-4 text-center"
        >
          <span class="text-3xl">🥈</span>
          <span class="text-sm font-semibold text-white">{{ podium[1].display_name }}</span>
          <span class="text-2xl font-bold text-white/80">{{ podium[1].total_points }}</span>
          <span class="text-xs text-white/50">pts</span>
        </GlassCard>

        <GlassCard
          v-if="podium[0]"
          class="order-2 flex min-h-[200px] flex-col items-center justify-end gap-1 p-4 text-center ring-2 ring-gold-400/60"
        >
          <span class="text-4xl">🥇</span>
          <span class="text-base font-bold text-white">{{ podium[0].display_name }}</span>
          <span class="text-3xl font-bold text-gold-400">{{ podium[0].total_points }}</span>
          <span class="text-xs text-white/50">pts</span>
        </GlassCard>

        <GlassCard
          v-if="podium[2]"
          class="order-3 flex min-h-[140px] flex-col items-center justify-end gap-1 p-4 text-center"
        >
          <span class="text-3xl">🥉</span>
          <span class="text-sm font-semibold text-white">{{ podium[2].display_name }}</span>
          <span class="text-2xl font-bold text-white/80">{{ podium[2].total_points }}</span>
          <span class="text-xs text-white/50">pts</span>
        </GlassCard>
      </div>

      <BaseInput
        v-model="searchQuery"
        placeholder="Buscar usuario para ver su posición"
        class="sm:max-w-xs"
      />

      <GlassCard v-if="filteredRankings.length > 0" class="flex flex-col">
        <div
          v-for="ranking in filteredRankings"
          :key="ranking.id"
          class="flex items-center justify-between gap-4 border-t border-white/5 px-4 py-3 first:border-t-0"
        >
          <div class="flex items-center gap-3">
            <span class="w-6 text-center text-sm font-semibold text-white/40">{{
              ranking.position
            }}</span>
            <span class="text-sm text-white/80">{{ ranking.display_name }}</span>
          </div>
          <span class="text-sm font-bold text-white">{{ ranking.total_points }} pts</span>
        </div>
      </GlassCard>

      <p v-else-if="searchQuery.trim()" class="text-center text-white/60">
        No se encontraron usuarios con ese nombre.
      </p>
    </template>

    <p v-else class="text-center text-white/60">Todavía no hay usuarios registrados.</p>
  </div>
</template>

<script setup lang="ts">
import BaseInput from '@/components/ui/BaseInput.vue'
import GlassCard from '@/components/ui/GlassCard.vue'

import useRankingsView from './Rankings'

const { podium, filteredRankings, searchQuery, isLoading } = useRankingsView()
</script>
