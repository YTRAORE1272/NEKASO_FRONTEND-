<template>
  <div class="public-layout">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style scoped>
.public-layout {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
