<template>
  <GlassCard class="flex flex-col gap-3 p-5">
    <h3 class="text-xs font-semibold uppercase tracking-wider text-white/60">{{ title }}</h3>
    <div class="flex flex-1 flex-col justify-center">
      <slot />
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import GlassCard from './GlassCard.vue'

defineProps<{
  title: string
}>()
</script>
