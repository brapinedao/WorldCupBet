<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      @click.self="close"
    >
      <div
        class="w-full max-w-md rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-xl shadow-black/40"
      >
        <div class="mb-4 flex items-center justify-between gap-4">
          <h2 class="text-lg font-bold text-white">{{ title }}</h2>
          <button
            type="button"
            class="text-white/50 transition hover:text-white"
            aria-label="Cerrar"
            @click="close"
          >
            ✕
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const close = (): void => {
  emit('update:modelValue', false)
}
</script>
