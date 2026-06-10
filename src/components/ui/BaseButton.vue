<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
      variant === 'primary'
        ? 'bg-gold-cta text-navy-950 hover:brightness-110'
        : 'border border-white/15 bg-white/5 text-white hover:bg-white/10',
    ]"
  >
    <span
      v-if="loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'glass'
    type?: 'button' | 'submit'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
    loading: false,
  },
)
</script>
