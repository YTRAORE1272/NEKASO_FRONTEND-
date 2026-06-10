import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notificationsService } from '@/services/notifications.service'
import { mockNotifications } from '@/services/mockData'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])
  const chargement = ref(false)

  const nonLues = computed(() => notifications.value.filter((n) => !n.lue))
  const compteur = computed(() => nonLues.value.length)

  async function charger(params = {}) {
    chargement.value = true
    try {
      // Try real API first
      try {
        const res = await notificationsService.getListe(params)
        notifications.value = res.data
      } catch (e) {
        // Fallback mock
        await new Promise((r) => setTimeout(r, 300))
        notifications.value = mockNotifications
      }
    } finally {
      chargement.value = false
    }
  }

  async function marquerLue(id) {
    // TODO : await notificationsService.marquerLue(id)
    notifications.value = notifications.value.map((n) => (n.id === id ? { ...n, lue: true } : n))
  }

  async function toutLire() {
    // TODO : await notificationsService.toutLire()
    notifications.value = notifications.value.map((n) => ({ ...n, lue: true }))
  }

  return { notifications, chargement, nonLues, compteur, charger, marquerLue, toutLire }
})
