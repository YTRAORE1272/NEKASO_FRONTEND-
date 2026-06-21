const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'src')

// ── Patterns dangereux ───────────────────────────────────────────────────────
const CRITICAL = [
  { re: /v-html\s*=/, desc: 'v-html (XSS via injection HTML)' },
  { re: /\.innerHTML\s*=/, desc: 'innerHTML assignment (XSS possible)' },
  { re: /\.outerHTML\s*=/, desc: 'outerHTML assignment (XSS possible)' },
  { re: /document\.write\s*\(/, desc: 'document.write() (injection DOM)' },
  { re: /eval\s*\(/, desc: 'eval() (RCE côté navigateur)' },
  { re: /new\s+Function\s*\(/, desc: 'new Function() (eval équivalent)' },
  { re: /setTimeout\s*\(\s*['"`]/, desc: 'setTimeout avec string (eval caché)' },
  { re: /setInterval\s*\(\s*['"`]/, desc: 'setInterval avec string (eval caché)' },
]

const WARNINGS = [
  // Secrets hardcodés
  {
    re: /(?:password|passwd|secret|api[_-]?key|private[_-]?key)\s*[:=]\s*['"][^'"]{6,}/i,
    desc: 'Secret potentiellement hardcodé (mot de passe / clé API)',
  },
  {
    re: /Bearer\s+[A-Za-z0-9\-._~+/]+=*/,
    desc: 'Token Bearer hardcodé détecté',
  },
  {
    re: /Authorization\s*:\s*['"]Bearer/,
    desc: 'Header Authorization hardcodé (sans variable)',
  },
  // Logs de données sensibles
  {
    re: /console\.(log|info|debug)\s*\([^)]*(?:token|password|secret|mot de passe)/i,
    desc: 'console.log avec données sensibles (token/password)',
  },
  // localStorage pour données sensibles
  {
    re: /localStorage\.setItem\s*\(\s*['"][^'"]*(?:token|secret|password|user)[^'"]*['"]/i,
    desc: 'localStorage utilisé pour données sensibles (préférer sessionStorage)',
  },
  // URLs HTTP non sécurisées dans les appels fetch/axios (pas les images mock)
  {
    re: /(?:fetch|axios\.(?:get|post|put|delete|patch))\s*\(\s*['"]http:\/\/(?!localhost|127\.0\.0\.1)/,
    desc: 'Appel fetch/axios vers URL HTTP non-localhost (utiliser HTTPS en production)',
  },
  // Injection SQL côté client (ORM mal utilisé)
  {
    re: /['"`]\s*SELECT\s+.+\s+FROM\s+/i,
    desc: 'Requête SQL dans le code frontend (architecture douteuse)',
  },
  // postMessage sans origin check
  {
    re: /addEventListener\s*\(\s*['"]message['"]/,
    desc: 'addEventListener("message") sans vérification d\'origine — risque postMessage injection',
  },
  // window.location avec user input
  {
    re: /window\.location\s*=\s*(?!['"]\/)/,
    desc: 'window.location assigné à une variable (open redirect possible)',
  },
  // Prototype pollution
  {
    re: /__proto__\s*\[/,
    desc: 'Accès à __proto__ (prototype pollution)',
  },
  {
    re: /constructor\s*\[\s*['"]prototype['"]/,
    desc: 'constructor[prototype] — prototype pollution possible',
  },
]

// ── Whitelist : fichiers/patterns légitimes à ignorer ───────────────────────
const WHITELIST_FILES = [
  'security-check.cjs', // ce fichier lui-même
]

const WHITELIST_CONTEXTS = [
  // Faux positif : commentaire qui mentionne le mot "token"
  // Géré ligne par ligne si nécessaire
]

// ── Parcours récursif ────────────────────────────────────────────────────────
function walk(dir, cb) {
  const entries = fs.readdirSync(dir)
  entries.forEach((entry) => {
    const full = path.join(dir, entry)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      walk(full, cb)
    } else if (/\.(js|vue|ts)$/.test(entry)) {
      cb(full)
    }
  })
}

// ── Analyse ──────────────────────────────────────────────────────────────────
const criticals = []
const warnings = []

walk(SRC, (file) => {
  const basename = path.basename(file)
  if (WHITELIST_FILES.includes(basename)) return

  const lines = fs.readFileSync(file, 'utf8').split('\n')

  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    // Ignorer les commentaires purs
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('<!--')) return

    CRITICAL.forEach((p) => {
      const m = line.match(p.re)
      if (m) {
        criticals.push({
          file: path.relative(ROOT, file),
          line: idx + 1,
          desc: p.desc,
          match: m[0].trim(),
        })
      }
    })

    WARNINGS.forEach((p) => {
      const m = line.match(p.re)
      if (m) {
        warnings.push({
          file: path.relative(ROOT, file),
          line: idx + 1,
          desc: p.desc,
          match: m[0].trim().substring(0, 60),
        })
      }
    })
  })
})

// ── Rapport ──────────────────────────────────────────────────────────────────
const ok = criticals.length === 0

if (criticals.length > 0) {
  console.error('\n🚨  SECURITE CRITIQUE — patterns dangereux détectés:\n')
  criticals.forEach((f) => {
    console.error(`  ❌  ${f.file}:${f.line}`)
    console.error(`      ${f.desc}`)
    console.error(`      -> ${f.match}\n`)
  })
}

if (warnings.length > 0) {
  console.warn('\n⚠️   AVERTISSEMENTS de sécurité:\n')
  warnings.forEach((f) => {
    console.warn(`  ⚠️   ${f.file}:${f.line}`)
    console.warn(`      ${f.desc}`)
    console.warn(`      -> ${f.match}\n`)
  })
}

if (ok && warnings.length === 0) {
  console.log('✅  Security check: passed — aucun pattern dangereux trouvé')
} else if (ok) {
  console.log(`\n✅  Security check: passed (${warnings.length} avertissement(s) à examiner)`)
} else {
  console.error(`\n💥  Security check: FAILED (${criticals.length} critique(s), ${warnings.length} avertissement(s))`)
  process.exitCode = 2
}
