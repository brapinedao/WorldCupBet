<template>
  <aside
    class="sticky top-0 z-10 flex max-h-screen flex-col gap-4 overflow-y-auto border-b border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl lg:h-screen lg:w-64 lg:shrink-0 lg:gap-6 lg:border-b-0 lg:border-r lg:px-6 lg:py-8"
  >
    <div class="flex flex-col gap-1">
      <h1 class="text-sm font-bold leading-tight">
        🏆 HP AMS World Cup <span class="bg-gold-cta bg-clip-text text-transparent">2026</span>
      </h1>
      <p class="text-sm text-white/60 mt-2">Hola, {{ display_name }}</p>
    </div>

    <nav class="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition"
        :class="
          route.name === item.name
            ? 'bg-gold-cta text-navy-950'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        "
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <BaseButton variant="glass" class="lg:mt-auto" @click="handleLogout">
      Cerrar sesión
    </BaseButton>
  </aside>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuthStore } from '@/stores/auth/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const { display_name } = storeToRefs(authStore)
const { _clearUser } = authStore

const navItems = [
  { name: 'Predictions', label: 'Predicciones' },
  { name: 'AllPredictions', label: 'Pronósticos de Todos' },
  { name: 'Groups', label: 'Equipos y Grupos' },
  { name: 'Ranking', label: 'Ranking' },
  { name: 'Premios', label: 'Premios' },
] as const

const handleLogout = (): void => {
  _clearUser()
  router.push({ name: 'Login' })
}
</script>
