<template>
  <GlassCard class="flex flex-col gap-2 p-4">
    <span class="text-2xl">{{ emoji }}</span>
    <h4 class="text-sm font-semibold text-white">{{ headline }}</h4>
    <p class="text-xs text-white/60">{{ excerpt }}</p>
  </GlassCard>
</template>

<script setup lang="ts">
import GlassCard from './GlassCard.vue'

defineProps<{
  emoji: string
  headline: string
  excerpt: string
}>()
</script>
