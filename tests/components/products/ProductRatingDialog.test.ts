import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import ProductRatingDialog from '@/components/products/ProductRatingDialog.vue'
import { mountWithApp } from '../../helpers/mountComponent'

function queryDialog(): HTMLElement | null {
  return document.querySelector('[role="dialog"]')
}

function findButtonByText(root: ParentNode, text: string): HTMLButtonElement | undefined {
  return Array.from(root.querySelectorAll('button')).find((button) =>
    button.textContent?.includes(text),
  )
}

describe('ProductRatingDialog', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('não exibe o diálogo enquanto visible é false', async () => {
    const { wrapper } = await mountWithApp(ProductRatingDialog, {
      props: { visible: false },
      attachTo: document.body,
    })

    expect(queryDialog()).toBeNull()
    wrapper.unmount()
  })

  it('abre com título, instrução e confirmar desabilitado sem seleção', async () => {
    const { wrapper } = await mountWithApp(ProductRatingDialog, {
      props: { visible: true },
      attachTo: document.body,
    })
    await nextTick()

    const dialog = queryDialog()
    expect(dialog).not.toBeNull()
    expect(dialog?.textContent).toContain('Avaliar produto')
    expect(dialog?.textContent).toContain('Selecione de 1 a 5 estrelas.')
    expect(dialog?.textContent).not.toContain('comentário')
    expect(findButtonByText(dialog!, 'Confirmar')?.disabled).toBe(true)

    wrapper.unmount()
  })

  it('seleciona estrelas, permite alterar e confirma a avaliação', async () => {
    const { wrapper } = await mountWithApp(ProductRatingDialog, {
      props: { visible: true },
      attachTo: document.body,
    })
    await nextTick()

    const dialog = queryDialog()!
    const stars = Array.from(dialog.querySelectorAll<HTMLButtonElement>('[role="radio"]'))
    expect(stars).toHaveLength(5)
    expect(stars[0]?.getAttribute('aria-label')).toBe('1 estrela')
    expect(stars[4]?.getAttribute('aria-label')).toBe('5 estrelas')

    stars[4]?.click()
    await nextTick()

    expect(stars[4]?.getAttribute('aria-checked')).toBe('true')
    expect(stars[0]?.getAttribute('aria-checked')).toBe('false')
    expect(findButtonByText(dialog, 'Confirmar')?.disabled).toBe(false)

    stars[2]?.click()
    await nextTick()
    expect(stars[2]?.getAttribute('aria-checked')).toBe('true')
    expect(stars[4]?.getAttribute('aria-checked')).toBe('false')
    expect(dialog.textContent).toContain('3 estrelas')

    findButtonByText(dialog, 'Confirmar')?.click()
    await nextTick()

    expect(wrapper.emitted('confirm')).toEqual([[3]])
    wrapper.unmount()
  })

  it('cancela fechando o modal sem confirmar', async () => {
    const { wrapper } = await mountWithApp(ProductRatingDialog, {
      props: { visible: true },
      attachTo: document.body,
    })
    await nextTick()

    findButtonByText(queryDialog()!, 'Cancelar')?.click()
    await nextTick()

    expect(wrapper.emitted('update:visible')).toEqual([[false]])
    expect(wrapper.emitted('confirm')).toBeUndefined()
    wrapper.unmount()
  })

  it('pré-seleciona avaliação existente ao alterar', async () => {
    const { wrapper } = await mountWithApp(ProductRatingDialog, {
      props: { visible: true, initialRating: 4 },
      attachTo: document.body,
    })
    await nextTick()

    const dialog = queryDialog()!
    const stars = Array.from(dialog.querySelectorAll<HTMLButtonElement>('[role="radio"]'))

    expect(stars[3]?.getAttribute('aria-checked')).toBe('true')
    expect(findButtonByText(dialog, 'Confirmar')?.disabled).toBe(false)

    stars[4]?.click()
    await nextTick()
    findButtonByText(dialog, 'Confirmar')?.click()
    await nextTick()

    expect(wrapper.emitted('confirm')).toEqual([[5]])
    wrapper.unmount()
  })

  it('navega as estrelas pelo teclado', async () => {
    const { wrapper } = await mountWithApp(ProductRatingDialog, {
      props: { visible: true },
      attachTo: document.body,
    })
    await nextTick()

    const stars = Array.from(queryDialog()!.querySelectorAll<HTMLButtonElement>('[role="radio"]'))
    stars[0]?.focus()
    stars[0]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick()

    expect(stars[1]?.getAttribute('aria-checked')).toBe('true')

    stars[1]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    await nextTick()
    expect(stars[4]?.getAttribute('aria-checked')).toBe('true')

    wrapper.unmount()
  })
})
