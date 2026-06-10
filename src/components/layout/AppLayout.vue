<template>
  <div class="flex min-h-screen flex-col bg-navy-radial text-white lg:flex-row">
    <AppSidebar />
    <main class="flex-1 px-4 py-8 sm:px-8 lg:px-12">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
</script>
