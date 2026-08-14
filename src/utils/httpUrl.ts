/** Comprimento máximo aceito para URLs HTTP(S) externas (imagens, etc.). */
export const MAX_HTTP_URL_LENGTH = 2048

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:'])

/**
 * Normaliza e aceita somente URLs `http:` / `https:`.
 * Rejeita `javascript:`, `data:`, `vbscript:` e equivalentes.
 */
export function toSafeHttpUrl(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()

  if (trimmed.length === 0 || trimmed.length > MAX_HTTP_URL_LENGTH) {
    return null
  }

  if (/\s/.test(trimmed)) {
    return null
  }

  try {
    const url = new URL(trimmed)

    if (!ALLOWED_PROTOCOLS.has(url.protocol) || url.hostname.length === 0) {
      return null
    }

    return trimmed
  } catch {
    return null
  }
}

export function isAllowedHttpUrl(value: unknown): boolean {
  return toSafeHttpUrl(value) !== null
}
