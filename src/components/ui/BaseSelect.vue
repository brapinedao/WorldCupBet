<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-medium text-white/80">{{ label }}</label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        class="w-full appearance-none rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pr-10 text-white outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          class="bg-navy-900 text-white"
        >
          {{ option.label }}
        </option>
      </select>
      <svg
        class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  options: { value: string; label: string }[]
  label?: string
  id?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
