<template>
  <main class="grid min-h-screen grid-cols-1 bg-navy-radial text-white lg:grid-cols-2">
    <!-- Left: Login -->
    <section class="relative flex items-center justify-center overflow-hidden px-6 py-16">
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          class="absolute left-[10%] top-[15%] h-2 w-2 rounded-full bg-gold-400/60 blur-[1px]"
        />
        <span class="absolute left-[70%] top-[25%] h-1.5 w-1.5 rounded-full bg-gold-400/40" />
        <span
          class="absolute left-[85%] top-[60%] h-2 w-2 rounded-full bg-gold-400/50 blur-[1px]"
        />
        <span class="absolute left-[20%] top-[75%] h-1 w-1 rounded-full bg-white/30" />
        <span class="absolute left-[45%] top-[40%] h-1.5 w-1.5 rounded-full bg-white/30" />
        <span
          class="absolute left-[30%] top-[50%] h-px w-32 rotate-12 bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"
        />
        <span
          class="absolute left-[55%] top-[35%] h-px w-40 -rotate-6 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        <div class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-navy-600/40 blur-3xl" />
        <div class="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
      </div>

      <div class="relative z-10 flex w-full max-w-sm flex-col items-center gap-8 text-center">
        <div class="flex flex-col items-center gap-3">
          <div class="flex items-end justify-center gap-2">
            <svg
              viewBox="0 0 100 100"
              class="animate-player-kick h-24 w-24 origin-bottom"
              aria-hidden="true"
            >
              <g
                fill="none"
                stroke="white"
                stroke-width="9"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M40 26 L46 54" />
                <path d="M40 28 L50 42 L60 50" />
                <path d="M46 54 L42 74 L40 90" />
              </g>
              <circle cx="40" cy="16" r="10" fill="#ffd166" />
              <path
                class="animate-arm-swing"
                style="transform-origin: 40px 28px"
                d="M40 28 L30 46 L24 60"
                fill="none"
                stroke="white"
                stroke-width="9"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                class="animate-leg-swing"
                style="transform-origin: 46px 54px"
                d="M46 54 L54 74 L58 90"
                fill="none"
                stroke="white"
                stroke-width="9"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <div
              class="animate-kick-ball flex h-14 w-14 items-center justify-center rounded-full bg-gold-cta text-navy-950 shadow-lg shadow-gold-500/30"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                role="img"
                aria-label="HP"
                class="h-9 w-9"
              >
                <path
                  d="M12 24h-.4l2.5-6.7h3.4c.6 0 1.2-.5 1.4-1L21.6 9c.4-1.2-.3-2.2-1.5-2.2h-4.7l-3.9 10.8-2.2 6.1C3.9 22.4 0 17.7 0 12 0 6.5 3.7 1.9 8.8.4L6.5 6.8 2.6 17.3h2.5l3.2-8.9h1.9L7 17.3h2.5l3-8.3c.4-1.2-.2-2.2-1.5-2.2H9L11.5 0h.5c6.6 0 12 5.4 12 12s-5.4 12-12 12zm7.3-15.7h-1.9l-2.7 7.3h1.9l2.7-7.3z"
                />
              </svg>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
              🏆 HP World Cup <span class="bg-gold-cta bg-clip-text text-transparent">2026</span>
            </h1>
            <p class="text-sm text-white/60">Internal access for HP AMS Team</p>
          </div>
        </div>

        <GlassCard class="w-full p-6 sm:p-8">
          <form class="flex flex-col gap-5" @submit.prevent="handleLogin">
            <BaseInput
              id="username"
              v-model="username"
              label="Usuario"
              placeholder="Ingresa tu usuario"
              autocomplete="username"
              :error="error"
            />
            <BaseButton type="submit" variant="primary" :loading="isSubmitting">
              Ingresar
            </BaseButton>
          </form>
        </GlassCard>
      </div>
    </section>

    <!-- Right: Copa Mundial 2026 Inmersiva -->
    <aside class="flex flex-col justify-center gap-6 px-6 py-16 lg:px-12 lg:py-24 xl:px-20">
      <h2
        class="bg-gold-cta bg-clip-text text-2xl font-extrabold uppercase tracking-wide text-transparent sm:text-3xl"
      >
        🌎 Vive el Mundial 2026 con HP
      </h2>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard v-for="match in upcomingMatches" :key="match.id" title="Próximo Partido">
          <MatchCard
            :home-team="match.home_team"
            :away-team="match.away_team"
            :match-date="match.match_date"
            :venue="match.venue"
          />
        </StatCard>
      </div>

      <div class="flex flex-col gap-3">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-white/60">
          Noticias Rápidas
        </h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NewsCard v-for="item in newsItems" :key="item.headline" v-bind="item" />
        </div>
      </div>
    </aside>
  </main>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import MatchCard from '@/components/ui/MatchCard.vue'
import NewsCard from '@/components/ui/NewsCard.vue'
import StatCard from '@/components/ui/StatCard.vue'

import useLogin from './Login'

const { username, error, isSubmitting, handleLogin, upcomingMatches, newsItems } = useLogin()
</script>
