
export function unwrap(res) {
  const body = res?.data ?? res
  if (
    body &&
    typeof body === 'object' &&
    'success' in body &&
    'message' in body &&
    'status' in body &&
    'timestamp' in body
  ) {
    return body.message
  }
  return body
}

export function unwrapList(res) {
  const body = unwrap(res)
  if (Array.isArray(body)) return body
  if (Array.isArray(body?.content)) return body.content
  if (Array.isArray(body?.data)) return body.data
  return []
}

export function pageMeta(res) {
  const body = unwrap(res)
  const liste = unwrapList(res)
  return {
    items: liste,
    page: body?.number ?? body?.currentPage ?? 0,
    size: body?.size ?? body?.pageSize ?? liste.length,
    totalElements: body?.totalElements ?? liste.length,
    totalPages: body?.totalPages ?? 1,
    isFirst: body?.first ?? body?.isFirst ?? true,
    isLast: body?.last ?? body?.isLast ?? true,
  }
}

export function extraireMessageErreur(err, fallback = "Une erreur s'est produite") {
  if (!err?.response) return 'Impossible de contacter le serveur. Vérifiez votre connexion.'
  const msg = err.response.data?.message
  if (msg && typeof msg === 'object') return Object.values(msg).join(' ')
  if (typeof msg === 'string') return msg
  return fallback
}

export function listeOuVide(promesse) {
  return promesse
    .then((res) => unwrapList(res))
    .catch((e) => {
      if (e?.response?.status === 404) return []
      throw e
    })
}

const CHAMPS_DATE = [
  'dateCreation',
  'dateAjout',
  'dateDemande',
  'dateSignature',
  'datePaiement',
  'dateDebut',
  'dateDebutPrevu',
]

function valeurDate(item, champ) {
  if (champ) return item?.[champ]
  for (const c of CHAMPS_DATE) {
    if (item?.[c]) return item[c]
  }
  return null
}

export function trierParDateDecroissante(liste, champ = null) {
  if (!Array.isArray(liste)) return []
  return [...liste].sort((a, b) => {
    const da = new Date(valeurDate(a, champ) || 0).getTime()
    const db = new Date(valeurDate(b, champ) || 0).getTime()
    if (db !== da) return db - da
    return (Number(b?.id) || 0) - (Number(a?.id) || 0)
  })
}
