export const profilLocataireService = {
  async getProfil() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          nom: 'Diop',
          prenom: 'Aminata',
          telephone: '+221 77 123 45 67',
          whatsapp: '+221 77 123 45 67',
          email: 'aminata.diop@example.com',
          notifications: {
            email: true,
            whatsapp: true,
            sms: false
          }
        })
      }, 500)
    })
  },
  
  async updateProfil(data) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, data })
      }, 500)
    })
  }
}
