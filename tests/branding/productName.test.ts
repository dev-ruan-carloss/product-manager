import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import en from '@/i18n/locales/en'
import es from '@/i18n/locales/es'
import ptBR from '@/i18n/locales/pt-BR'

const PRODUCTION_URL = 'https://product-manager-eta-seven.vercel.app/'
const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')

describe('identidade Product Management', () => {
  it('usa Product Management nos metadados principais do index.html', () => {
    expect(html).toContain('<title>Product Management — Catálogo e gestão de produtos</title>')
    expect(html).toContain('property="og:site_name" content="Product Management"')
    expect(html).toContain(
      'property="og:title" content="Product Management — Catálogo e gestão de produtos"',
    )
    expect(html).toContain(
      'name="twitter:title" content="Product Management — Catálogo e gestão de produtos"',
    )
    expect(html).toContain('Tela de catálogo do Product Management')
  })

  it('não usa o nome antigo Product Manager nos metadados ativos', () => {
    expect(html).not.toContain('Product Manager')
  })

  it('mantém a URL canônica de produção inalterada', () => {
    expect(html).toContain(`rel="canonical" href="${PRODUCTION_URL}"`)
    expect(html).toContain(`property="og:url" content="${PRODUCTION_URL}"`)
  })

  it('expõe o nome oficial da aplicação em PT-BR, EN e ES', () => {
    expect(ptBR.brand.name).toBe('Product Management')
    expect(en.brand.name).toBe('Product Management')
    expect(es.brand.name).toBe('Product Management')

    expect(ptBR.brand.homeAria).toContain('Product Management')
    expect(en.brand.homeAria).toContain('Product Management')
    expect(es.brand.homeAria).toContain('Product Management')

    expect(ptBR.footer.copyright).toContain('Product Management')
    expect(en.footer.copyright).toContain('Product Management')
    expect(es.footer.copyright).toContain('Product Management')
  })

  it('não usa Product Manager nas cópias de interface i18n', () => {
    expect(JSON.stringify(ptBR)).not.toContain('Product Manager')
    expect(JSON.stringify(en)).not.toContain('Product Manager')
    expect(JSON.stringify(es)).not.toContain('Product Manager')
  })
})
