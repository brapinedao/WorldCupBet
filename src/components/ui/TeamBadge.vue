<template>
  <div class="flex flex-col items-center gap-1 text-center">
    <img
      v-if="flagUrl"
      :src="flagUrl"
      :alt="name"
      class="h-8 w-8 rounded-full object-cover ring-1 ring-white/10"
    />
    <span class="text-xs font-medium text-white/80">{{ name }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  flagUrl?: string | null
}>()
</script>
