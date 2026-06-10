<template>
  <div class="locataire-layout">
    <HeaderLocataire />
    
    <div class="layout-content">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import HeaderLocataire from './HeaderLocataire.vue'
</script>

<style scoped>
.locataire-layout {
  min-height: 100vh;
  background-color: #f9fafb;
}

.layout-content {
  width: 100%;
}
</style>
