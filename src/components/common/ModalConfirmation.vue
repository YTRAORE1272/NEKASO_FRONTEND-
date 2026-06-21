<template>
  <div class="overlay" @click.self="$emit('annuler')">
    <div class="modal" :class="`modal--${variante}`">
      <div class="icone" :class="`icone--${variante}`">
        <svg v-if="variante === 'danger'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12" y2="17" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16" /><line x1="12" y1="8" x2="12" y2="8" />
        </svg>
      </div>

      <h3 class="titre">{{ titre }}</h3>
      <p v-if="message" class="message">{{ message }}</p>

      <div class="actions">
        <button class="btn-annuler" :disabled="enCours" @click="$emit('annuler')">
          {{ labelAnnuler }}
        </button>
        <button class="btn-confirmer" :class="`btn-confirmer--${variante}`" :disabled="enCours" @click="$emit('confirmer')">
          {{ enCours ? 'En cours...' : labelConfirmer }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  titre: { type: String, required: true },
  message: { type: String, default: '' },
  labelConfirmer: { type: String, default: 'Confirmer' },
  labelAnnuler: { type: String, default: 'Annuler' },
  variante: { type: String, default: 'danger' },
  enCours: { type: Boolean, default: false },
})
defineEmits(['confirmer', 'annuler'])
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 24px;
  backdrop-filter: blur(2px);
}
.modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  padding: 28px 26px 24px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25);
  animation: pop 0.16s ease-out;
}
@keyframes pop {
  from {
    transform: scale(0.94);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.icone {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.icone svg {
  width: 26px;
  height: 26px;
}
.icone--danger {
  background: #fee2e2;
  color: #dc2626;
}
.icone--info {
  background: #dbeafe;
  color: #2563eb;
}
.titre {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}
.message {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 22px;
  white-space: pre-line;
}
.actions {
  display: flex;
  gap: 12px;
}
.btn-annuler {
  flex: 1;
  padding: 11px 18px;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}
.btn-annuler:hover {
  background: #f8fafc;
}
.btn-confirmer {
  flex: 1;
  padding: 11px 18px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
}
.btn-confirmer--danger {
  background: #dc2626;
}
.btn-confirmer--danger:hover {
  background: #b91c1c;
}
.btn-confirmer--info {
  background: #2563eb;
}
.btn-confirmer--info:hover {
  background: #1d4ed8;
}
.btn-annuler:disabled,
.btn-confirmer:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
