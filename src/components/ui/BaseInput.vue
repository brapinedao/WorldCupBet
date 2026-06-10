<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-medium text-white/80">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :value="modelValue"
      class="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    type?: string
    placeholder?: string
    id?: string
    error?: string
    autocomplete?: string
    min?: number | string
    max?: number | string
  }>(),
  {
    type: 'text',
  },
)

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
