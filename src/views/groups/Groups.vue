<template>
  <div class="flex flex-col gap-6">
    <KnockoutBracket
      v-if="!isLoading && knockoutMatches.length > 0"
      :matches="knockoutMatches"
      :octavos-matches="octavosMatches"
    />

    <h1 class="text-2xl font-bold">Equipos y Grupos</h1>

    <p v-if="isLoading" class="text-center text-white/60">Cargando equipos...</p>

    <div v-else class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <GlassCard v-for="groupName in groupNames" :key="groupName" class="p-4">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-white/60">
          Grupo {{ groupName }}
        </h2>

        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-xs uppercase text-white/40">
              <th class="pb-2 font-medium">Equipo</th>
              <th class="pb-2 text-center font-medium">Pts</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="standing in standingsByGroup.get(groupName)"
              :key="standing.id"
              class="border-t border-white/5"
            >
              <td class="py-2">
                <div class="flex items-center gap-2">
                  <img
                    v-if="standing.flag_url"
                    :src="standing.flag_url"
                    :alt="standing.name"
                    class="h-5 w-5 rounded-full object-cover ring-1 ring-white/10"
                  />
                  <span class="text-white/80">{{ standing.name }}</span>
                </div>
              </td>
              <td class="text-center font-semibold text-white">{{ standing.points }}</td>
            </tr>
          </tbody>
        </table>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import GlassCard from '@/components/ui/GlassCard.vue'
import KnockoutBracket from '@/components/groups/KnockoutBracket.vue'

import useGroupsView from './Groups'

const { groupNames, standingsByGroup, knockoutMatches, octavosMatches, isLoading } = useGroupsView()
</script>
