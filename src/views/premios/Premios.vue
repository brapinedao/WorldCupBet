<template>
  <div class="relative flex flex-col gap-10 overflow-hidden pb-8">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-navy-600/30 blur-3xl" />
      <div class="absolute -right-20 top-40 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
      <span class="absolute left-[15%] top-[10%] h-1.5 w-1.5 rounded-full bg-gold-400/50" />
      <span class="absolute left-[80%] top-[20%] h-2 w-2 rounded-full bg-gold-400/40 blur-[1px]" />
      <span class="absolute left-[60%] top-[70%] h-1.5 w-1.5 rounded-full bg-white/30" />
    </div>

    <!-- Hero -->
    <div class="flex flex-col items-center gap-4 text-center">
      <span
        class="animate-fade-up inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-400"
      >
        🏆 HP AMS World Cup 2026
      </span>

      <h1
        class="animate-fade-up text-3xl font-extrabold tracking-tight sm:text-4xl"
        style="animation-delay: 0.1s"
      >
        Los <span class="bg-gold-cta bg-clip-text text-transparent">maravillosos</span> premios
      </h1>

      <p class="animate-fade-up text-white/60" style="animation-delay: 0.2s">
        Y ahora sí... lo que todos estaban esperando. 🎉🔥
      </p>

      <div
        v-if="areStatsRevealed"
        class="animate-fade-up flex flex-wrap justify-center gap-8"
        style="animation-delay: 0.3s"
      >
        <div v-for="stat in stats" :key="stat.label" class="flex flex-col items-center">
          <span class="text-2xl font-bold text-gold-400">{{ stat.value }}</span>
          <span class="text-xs uppercase tracking-wide text-white/50">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Podio -->
    <div class="grid grid-cols-1 items-end gap-5 sm:grid-cols-3">
      <GlassCard
        v-for="(prize, index) in prizes"
        :key="prize.place"
        class="animate-fade-up relative flex flex-col items-center gap-3 p-6 text-center transition hover:-translate-y-1"
        :class="
          prize.place === 1
            ? 'order-first border-gold-400/40 sm:order-none sm:scale-105 sm:animate-glow-pulse'
            : ''
        "
        :style="{ animationDelay: `${0.4 + index * 0.15}s` }"
      >
        <span
          v-if="prize.place === 1"
          class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-cta px-3 py-1 text-[10px] font-bold tracking-wider text-navy-950 shadow-lg shadow-gold-500/30"
        >
          ★ CAMPEÓN ★
        </span>

        <template v-if="prize.isRevealed">
          <span
            class="animate-float"
            :class="prize.place === 1 ? 'text-5xl' : 'text-4xl'"
            :style="{ animationDelay: `${index * 0.3}s` }"
          >
            {{ prize.medal }}
          </span>
          <span class="text-xs font-semibold uppercase tracking-wider text-white/50">
            {{ prize.badgeLabel }}
          </span>
          <h3 class="text-lg font-bold text-white">{{ prize.title }}</h3>

          <div class="flex flex-col gap-1 rounded-xl bg-white/5 px-4 py-3 text-sm text-white/70">
            <template v-for="(perk, perkIndex) in prize.perks" :key="perk">
              <span>{{ perk }}</span>
              <span v-if="perkIndex < prize.perks.length - 1" class="text-xs text-white/30">
                — o —
              </span>
            </template>
          </div>
        </template>

        <template v-else>
          <span class="text-4xl opacity-30">🔒</span>
          <span class="text-xs font-semibold uppercase tracking-wider text-white/40">
            {{ prize.badgeLabel }}
          </span>
          <p class="text-sm text-white/50">
            Se revela el <span class="font-semibold text-gold-400/80">{{ prize.revealLabel }}</span>
          </p>
        </template>
      </GlassCard>
    </div>

    <!-- Nota -->
    <GlassCard
      class="animate-fade-up border-gold-400/15 p-5 text-center text-sm leading-relaxed text-white/70"
      style="animation-delay: 0.85s"
    >
      💡 Cualquiera de las opciones del 1er lugar está
      <span class="text-gold-400">especialmente diseñada</span>
      para mitigar la tristeza, el dolor y la congoja... en caso de que su selección no haya salido
      campeona 🤩
    </GlassCard>

    <!-- Footer -->
    <div
      class="animate-fade-up flex flex-col items-center gap-4 text-center"
      style="animation-delay: 1s"
    >
      <p class="text-white/70">
        ✨ ¡A jugar, apostar con el corazón (o con estrategia 👀) y que gane el mejor!
      </p>
      <BaseButton variant="primary" @click="handleGoToPredictions">
        Hacer mi pronóstico →
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import GlassCard from '@/components/ui/GlassCard.vue'

import usePremios from './Premios'

const { prizes, stats, areStatsRevealed, handleGoToPredictions } = usePremios()
</script>
