import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import CreateCategoryDialog from '@/components/products/CreateCategoryDialog.vue'
import { PRODUCT_CATEGORY_MAX_LENGTH } from '@/schemas/productFormLimits'
import { mountWithApp } from '../../helpers/mountComponent'

const existing = ['electronics', 'jewelery']

function queryDialog(): HTMLElement | null {
  return document.querySelector('[role="dialog"]')
}

function findButtonByText(root: ParentNode, text: string): HTMLButtonElement | undefined {
  return Array.from(root.querySelectorAll('button')).find((button) =>
    button.textContent?.includes(text),
  )
}

async function setName(value: string): Promise<void> {
  const input = document.getElementById('new-category-name') as HTMLInputElement
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await nextTick()
}

describe('CreateCategoryDialog', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('não exibe o diálogo enquanto visible é false', async () => {
    const { wrapper } = await mountWithApp(CreateCategoryDialog, {
      props: { visible: false, existingCategories: existing },
      attachTo: document.body,
    })

    expect(queryDialog()).toBeNull()
    wrapper.unmount()
  })

  it('abre com campo de nome, confirmar e cancelar', async () => {
    const { wrapper } = await mountWithApp(CreateCategoryDialog, {
      props: { visible: true, existingCategories: existing },
      attachTo: document.body,
    })
    await nextTick()

    const dialog = queryDialog()
    expect(dialog).not.toBeNull()
    expect(dialog?.textContent).toContain('Nova categoria')
    expect(dialog?.textContent).toContain('Nome da categoria')
    expect(findButtonByText(dialog!, 'Confirmar')).toBeDefined()
    expect(findButtonByText(dialog!, 'Cancelar')).toBeDefined()
    wrapper.unmount()
  })

  it('emite confirm com o nome trimado quando válido', async () => {
    const { wrapper } = await mountWithApp(CreateCategoryDialog, {
      props: { visible: true, existingCategories: existing },
      attachTo: document.body,
    })
    await nextTick()

    await setName('  Esportes  ')
    findButtonByText(queryDialog()!, 'Confirmar')?.click()
    await nextTick()

    expect(wrapper.emitted('confirm')).toEqual([['Esportes']])
    wrapper.unmount()
  })

  it('rejeita vazio e somente espaços', async () => {
    const { wrapper } = await mountWithApp(CreateCategoryDialog, {
      props: { visible: true, existingCategories: existing },
      attachTo: document.body,
    })
    await nextTick()

    findButtonByText(queryDialog()!, 'Confirmar')?.click()
    await nextTick()
    expect(queryDialog()?.textContent).toContain('A categoria é obrigatória.')
    expect(wrapper.emitted('confirm')).toBeUndefined()

    await setName('   ')
    findButtonByText(queryDialog()!, 'Confirmar')?.click()
    await nextTick()
    expect(queryDialog()?.textContent).toContain('A categoria é obrigatória.')
    expect(wrapper.emitted('confirm')).toBeUndefined()
    wrapper.unmount()
  })

  it('rejeita categoria duplicada da API, inclusive por caixa e rótulo localizado', async () => {
    const { wrapper } = await mountWithApp(CreateCategoryDialog, {
      props: { visible: true, existingCategories: existing },
      attachTo: document.body,
    })
    await nextTick()

    await setName('Electronics')
    findButtonByText(queryDialog()!, 'Confirmar')?.click()
    await nextTick()
    expect(queryDialog()?.textContent).toContain('Esta categoria já existe.')

    await setName('Eletrônicos')
    findButtonByText(queryDialog()!, 'Confirmar')?.click()
    await nextTick()
    expect(queryDialog()?.textContent).toContain('Esta categoria já existe.')
    expect(wrapper.emitted('confirm')).toBeUndefined()
    wrapper.unmount()
  })

  it('rejeita nome acima do limite máximo', async () => {
    const { wrapper } = await mountWithApp(CreateCategoryDialog, {
      props: { visible: true, existingCategories: existing },
      attachTo: document.body,
    })
    await nextTick()

    await setName('A'.repeat(PRODUCT_CATEGORY_MAX_LENGTH + 1))
    findButtonByText(queryDialog()!, 'Confirmar')?.click()
    await nextTick()

    expect(queryDialog()?.textContent).toContain('A categoria deve ter no máximo 50 caracteres.')
    expect(wrapper.emitted('confirm')).toBeUndefined()
    wrapper.unmount()
  })

  it('cancela sem emitir confirm', async () => {
    const { wrapper } = await mountWithApp(CreateCategoryDialog, {
      props: { visible: true, existingCategories: existing },
      attachTo: document.body,
    })
    await nextTick()

    findButtonByText(queryDialog()!, 'Cancelar')?.click()
    await nextTick()

    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
    wrapper.unmount()
  })
})
