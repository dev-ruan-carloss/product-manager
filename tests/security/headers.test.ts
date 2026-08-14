import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('Security headers (Vercel)', () => {
  const vercel = JSON.parse(readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8')) as {
    headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>
  }

  const headers = Object.fromEntries(
    vercel.headers[0].headers.map((header) => [header.key, header.value]),
  )

  it('configura CSP restritiva e compatível com a SPA', () => {
    const csp = headers['Content-Security-Policy']

    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("script-src 'self'")
    expect(csp).not.toContain('unsafe-eval')
    expect(csp).not.toMatch(/script-src\s+\*/)
    expect(csp).not.toMatch(/default-src\s+\*/)
    expect(csp).toContain("style-src 'self' 'unsafe-inline'")
    expect(csp).toContain("connect-src 'self' https://fakestoreapi.com")
    expect(csp).toContain('img-src \'self\' http: https:')
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("base-uri 'self'")
    expect(csp).toContain("form-action 'self'")
  })

  it('configura os demais headers de proteção', () => {
    expect(headers['X-Content-Type-Options']).toBe('nosniff')
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['X-Frame-Options']).toBe('DENY')
    expect(headers['Permissions-Policy']).toContain('camera=()')
    expect(headers['Permissions-Policy']).toContain('microphone=()')
    expect(headers['Permissions-Policy']).toContain('geolocation=()')
    expect(headers['Permissions-Policy']).toContain('payment=()')
    expect(headers['Permissions-Policy']).toContain('usb=()')
  })
})
