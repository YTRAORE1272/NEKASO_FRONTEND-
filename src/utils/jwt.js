function parseJwt(token) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(decoded)))
  } catch (e) {
    return null
  }
}

function isExpired(token) {
  const payload = parseJwt(token)
  if (!payload || !payload.exp) return false
  const now = Math.floor(Date.now() / 1000)
  return payload.exp <= now
}

export { parseJwt, isExpired }
