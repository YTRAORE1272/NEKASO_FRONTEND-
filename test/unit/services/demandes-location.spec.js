import { describe, it, expect, vi } from 'vitest'
import api from '@/services/api'
import { demandesLocationService } from '@/services/demandes-location.service'

describe('demandes-location.service (gestionnaire)', () => {
  it('getListe() lit /demandes/gestionnaire/demandes-locations avec les params', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: { data: [] } })
    await demandesLocationService.getListe({ page: 0, size: 5 })
    expect(spy).toHaveBeenCalledWith('/demandes/gestionnaire/demandes-locations', {
      params: { page: 0, size: 5 },
    })
    spy.mockRestore()
  })

  it('changerStatut() patche /demandes/gestionnaire/demande/{id}/statut/{statut}', async () => {
    const spy = vi.spyOn(api, 'patch').mockResolvedValue({ data: {} })
    await demandesLocationService.changerStatut(7, 'VALIDEE')
    expect(spy).toHaveBeenCalledWith('/demandes/gestionnaire/demande/7/statut/VALIDEE')
    spy.mockRestore()
  })

  it('valider() / refuser() ciblent les bons statuts', async () => {
    const spy = vi.spyOn(api, 'patch').mockResolvedValue({ data: {} })
    await demandesLocationService.valider(3)
    await demandesLocationService.refuser(4)
    expect(spy).toHaveBeenNthCalledWith(1, '/demandes/gestionnaire/demande/3/statut/VALIDEE')
    expect(spy).toHaveBeenNthCalledWith(2, '/demandes/gestionnaire/demande/4/statut/REFUSEE')
    spy.mockRestore()
  })
})
