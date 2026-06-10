<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold">Premios</h1>

    <GlassCard v-if="isLoading" class="flex flex-col items-center gap-4 p-12 text-center">
      <span
        class="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-gold-400"
      ></span>
      <p class="text-white/60">Cargando premios...</p>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import GlassCard from '@/components/ui/GlassCard.vue'

import usePremios from './Premios'

const { isLoading } = usePremios()
</script>
