<template>
  <div class="filtre-catalogue">
    <!-- BARRE DE RECHERCHE -->
    <div class="filtre-search-row">
      <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          :value="recherche"
          @input="$emit('update:recherche', $event.target.value)"
          placeholder="Rechercher un bien ou un quartier..."
        />
      </div>

      <button class="btn-filtres-avances" @click="$emit('toggle-filtres')" :title="'Filtres avancés'">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" x2="4" y1="21" y2="14"/>
          <line x1="4" x2="4" y1="10" y2="3"/>
          <line x1="12" x2="12" y1="21" y2="12"/>
          <line x1="12" x2="12" y1="8" y2="3"/>
          <line x1="20" x2="20" y1="21" y2="16"/>
          <line x1="20" x2="20" y1="12" y2="3"/>
          <line x1="1" x2="7" y1="14" y2="14"/>
          <line x1="9" x2="15" y1="8" y2="8"/>
          <line x1="17" x2="23" y1="16" y2="16"/>
        </svg>
      </button>
    </div>

    <!-- PILLS DE CATÉGORIES -->
    <div class="category-pills">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="pill"
        :class="{ active: typeActif === cat.value }"
        @click="$emit('update:typeActif', cat.value)"
      >
        {{ cat.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  recherche: { type: String, default: '' },
  typeActif: { type: [String, null], default: null }
})

defineEmits(['update:recherche', 'update:typeActif', 'toggle-filtres'])

const categories = [
  { value: null, label: 'Tout' },
  { value: 'chambre', label: 'Chambre' },
  { value: 'studio', label: 'Studio' },
  { value: 'appartement', label: 'Appartement' },
  { value: 'villa', label: 'Villa' },
]
</script>

<style scoped>
.filtre-catalogue {
  margin-bottom: 32px;
}

.filtre-search-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 13px 16px;
  transition: border-color 0.2s;
}

.search-wrapper:focus-within {
  border-color: #9ca3af;
}

.search-wrapper svg {
  stroke: #9ca3af;
  flex-shrink: 0;
}

.search-wrapper input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #111827;
  background: transparent;
  font-family: inherit;
}

.search-wrapper input::placeholder {
  color: #9ca3af;
}

.btn-filtres-avances {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 13px 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-filtres-avances:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.btn-filtres-avances svg {
  stroke: #6b7280;
}

/* ── PILLS ── */
.category-pills {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pill {
  background-color: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 9px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.pill:hover {
  border-color: #d1d5db;
  background-color: #f9fafb;
}

.pill.active {
  background-color: #1f2937;
  border-color: #1f2937;
  color: #ffffff;
}

@media (max-width: 768px) {
  .filtre-search-row {
    flex-direction: column;
  }

  .category-pills {
    gap: 8px;
  }

  .pill {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
