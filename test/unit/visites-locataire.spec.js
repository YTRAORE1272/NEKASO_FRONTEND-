import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '../../src/services/api'
import { visitesLocataireService } from '../../src/services/visites-locataire.service'

describe('visites-locataire.service', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('demander() poste sur /visites/locataire/bien/{idBien} sans corps', async () => {
    const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: { id: 1, statut: 'EN_ATTENTE' } })

    const res = await visitesLocataireService.demander(12)

    expect(postSpy).toHaveBeenCalledTimes(1)
    expect(postSpy).toHaveBeenCalledWith('/visites/locataire/bien/12')
    expect(res.data).toEqual({ id: 1, statut: 'EN_ATTENTE' })
  })

  it('getVisites() lit /visites/locataire/mes_demandes avec les params de pagination', async () => {
    const getSpy = vi.spyOn(api, 'get').mockResolvedValue({ data: { data: [] } })

    await visitesLocataireService.getVisites({ page: 0, size: 5 })

    expect(getSpy).toHaveBeenCalledWith('/visites/locataire/mes_demandes', {
      params: { page: 0, size: 5 },
    })
  })
})
