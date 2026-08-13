import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import ProductForm from '@/components/products/ProductForm.vue'
import { i18n } from '@/i18n'
import type { ProductFormData } from '@/types/productForm'
import {
  formatPrice,
  formatPriceInput,
  getCurrencyAffix,
} from '@/utils/formatPrice'
import { invokeFormSubmit, mountWithApp } from '../../helpers/mountComponent'

const categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"]

const validValues: ProductFormData = {
  title: 'Fjallraven Backpack',
  price: 109.95,
  description: 'Your perfect pack for everyday use and walks in the forest.',
  category: "men's clothing",
  image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
}

const existingPrice = 7.95

const existingProduct: ProductFormData = {
  ...validValues,
  price: existingPrice,
}

function normalizeSpaces(value: string): string {
  return value.replace(/\u00a0|\u202f/g, ' ')
}

async function submitForm(
  wrapper: Awaited<ReturnType<typeof mountWithApp>>['wrapper'],
): Promise<void> {
  await invokeFormSubmit(wrapper)
  await flushPromises()
  await nextTick()
}

async function setPrice(
  wrapper: Awaited<ReturnType<typeof mountWithApp>>['wrapper'],
  value: number,
  locale: string = 'pt-BR',
): Promise<void> {
  const input = wrapper.get('#product-price')
  await input.setValue(formatPriceInput(value, locale))
  await input.trigger('blur')
  await nextTick()
}

describe('ProductForm', () => {
  it('renderiza campos, labels e hints auxiliares', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories },
    })

    expect(wrapper.get('#product-form-heading').text()).toBe('Informações do produto')
    expect(wrapper.get('label[for="product-title"]').text()).toContain('Título do produto')
    expect(wrapper.get('label[for="product-category"]').text()).toContain('Categoria')
    expect(wrapper.get('label[for="product-price"]').text()).toContain('Preço')
    expect(wrapper.get('label[for="product-image"]').text()).toContain('URL da imagem')
    expect(wrapper.get('label[for="product-description"]').text()).toContain('Descrição')
    expect(wrapper.get('#product-title-message').text()).toContain(
      'Digite um título claro e descritivo.',
    )
    expect(wrapper.get('#product-title').attributes('aria-required')).toBe('true')
    expect(wrapper.get('#product-title').attributes('aria-describedby')).toBe(
      'product-title-message',
    )
  })

  it('preenche valores iniciais no modo edição', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: {
        categories,
        initialValues: validValues,
        submitLabel: 'Salvar Alterações',
      },
    })

    expect((wrapper.get('#product-title').element as HTMLInputElement).value).toBe(
      validValues.title,
    )
    expect((wrapper.get('#product-image').element as HTMLInputElement).value).toBe(
      validValues.image,
    )
    expect((wrapper.get('#product-description').element as HTMLTextAreaElement).value).toBe(
      validValues.description,
    )
    expect(wrapper.text()).toContain('Salvar Alterações')
  })

  it('mostra erros, aria-invalid e role=alert no submit vazio', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories },
      attachTo: document.body,
    })

    await submitForm(wrapper)

    expect(wrapper.get('#product-title').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('#product-title-message').attributes('role')).toBe('alert')
    expect(wrapper.get('#product-title-message').text()).toBe('O título é obrigatório.')
    expect(wrapper.get('#product-description-message').text()).toBe(
      'A descrição é obrigatória.',
    )
    expect(wrapper.get('#product-description-message').attributes('role')).toBe('alert')
    expect(wrapper.emitted('submit')).toBeUndefined()
    wrapper.unmount()
  })

  it('preserva hierarquia visual e ARIA no estado de erro', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories },
      attachTo: document.body,
    })

    await submitForm(wrapper)

    const titleInput = wrapper.get('#product-title')
    const titleMessage = wrapper.get('#product-title-message')
    const titleEl = titleInput.element as HTMLInputElement

    expect(titleInput.attributes('aria-invalid')).toBe('true')
    expect(titleInput.attributes('aria-describedby')).toBe('product-title-message')
    expect(titleInput.attributes('aria-required')).toBe('true')
    expect(titleMessage.attributes('role')).toBe('alert')
    expect(titleMessage.classes()).toContain('text-red-600')
    expect(titleInput.classes().some((c) => c.includes('text-red'))).toBe(false)

    titleEl.value = 'Produto válido'
    titleEl.dispatchEvent(new Event('input'))
    await nextTick()

    expect(getComputedStyle(titleEl).color).not.toBe(getComputedStyle(titleMessage.element).color)

    wrapper.unmount()
  })

  it('emite submit com payload válido a partir dos valores iniciais', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories, initialValues: validValues },
    })

    await submitForm(wrapper)

    expect(wrapper.emitted('submit')).toEqual([
      [
        {
          title: validValues.title,
          price: validValues.price,
          description: validValues.description,
          category: validValues.category,
          image: validValues.image,
        },
      ],
    ])
  })

  it('emite cancel e bloqueia cancelamento durante submitting', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories },
    })

    const cancelButton = wrapper
      .findAll('button')
      .find((btn) => btn.text().includes('Cancelar'))
    await cancelButton!.trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)

    await wrapper.setProps({ submitting: true })
    await cancelButton!.trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('desabilita submit e expõe aria-busy durante loading', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories, submitting: true },
    })

    const submit = wrapper.get('button[type="submit"]')
    expect(submit.attributes('disabled')).toBeDefined()
    expect(submit.attributes('aria-busy')).toBe('true')
    expect(wrapper.get('#product-title').attributes('disabled')).toBeDefined()
  })

  it('oferece retryCategories quando não há categorias disponíveis', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories: [], categoriesLoading: false },
    })

    expect(wrapper.text()).toContain('Não foi possível carregar as categorias.')
    const retry = wrapper
      .findAll('button')
      .find((btn) => btn.text() === 'Tentar novamente')
    await retry!.trigger('click')
    expect(wrapper.emitted('retryCategories')).toHaveLength(1)
  })

  it('exibe submitError sem apagar os valores preenchidos', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: {
        categories,
        initialValues: validValues,
        submitError: 'Não foi possível salvar o produto. Verifique sua conexão e tente novamente.',
      },
    })

    expect(wrapper.get('#product-form-submit-error').attributes('role')).toBe('alert')
    expect(wrapper.get('#product-form-submit-error').text()).toContain(
      'Não foi possível salvar o produto',
    )
    expect((wrapper.get('#product-title').element as HTMLInputElement).value).toBe(validValues.title)
    expect((wrapper.get('#product-description').element as HTMLTextAreaElement).value).toBe(
      validValues.description,
    )
  })

  it('atualiza a prévia com o título informado', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories },
    })

    expect(wrapper.text()).toContain('Título do produto')
    await wrapper.get('#product-title').setValue('Preview Title')
    await nextTick()
    expect(wrapper.get('#product-preview-heading').exists()).toBe(true)
    expect(wrapper.text()).toContain('Preview Title')
  })

  it('exibe preço formatado no preview com o mesmo formatter', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories, initialValues: validValues },
    })

    expect(normalizeSpaces(wrapper.text())).toContain(
      normalizeSpaces(formatPrice(validValues.price!, 'pt-BR')),
    )
  })

  it('atualiza o preview ao trocar o locale sem alterar o valor numérico', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories, initialValues: validValues },
    })

    expect(normalizeSpaces(wrapper.text())).toContain(
      normalizeSpaces(formatPrice(validValues.price!, 'pt-BR')),
    )

    i18n.global.locale.value = 'en'
    await nextTick()
    expect(normalizeSpaces(wrapper.text())).toContain(
      normalizeSpaces(formatPrice(validValues.price!, 'en')),
    )

    i18n.global.locale.value = 'es'
    await nextTick()
    expect(normalizeSpaces(wrapper.text())).toContain(
      normalizeSpaces(formatPrice(validValues.price!, 'es')),
    )

    await submitForm(wrapper)
    expect(wrapper.emitted('submit')).toEqual([
      [
        {
          title: validValues.title,
          price: validValues.price,
          description: validValues.description,
          category: validValues.category,
          image: validValues.image,
        },
      ],
    ])
  })

  it('mantém preço existente numérico e símbolo fora do value do input', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories, initialValues: existingProduct },
    })

    const priceInput = wrapper.get('#product-price').element as HTMLInputElement
    expect(priceInput.value).toBe(formatPriceInput(existingPrice, 'pt-BR'))
    expect(priceInput.value).not.toContain('R$')
    expect(priceInput.value).not.toContain('$')
    expect(priceInput.value).not.toContain('€')

    const affix = getCurrencyAffix('pt-BR')
    expect(wrapper.text()).toContain(affix.symbol)
    expect(normalizeSpaces(wrapper.text())).toContain(
      normalizeSpaces(formatPrice(existingPrice, 'pt-BR')),
    )
  })

  it('seleciona o valor ao focar para permitir substituição imediata', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories, initialValues: existingProduct },
      attachTo: document.body,
    })

    const input = wrapper.get('#product-price')
    const el = input.element as HTMLInputElement
    el.focus()
    await input.trigger('focus')
    await nextTick()
    await flushPromises()

    expect(el.selectionStart).toBe(0)
    expect(el.selectionEnd).toBe(el.value.length)
    expect(el.value).toBe(formatPriceInput(existingPrice, 'pt-BR'))

    wrapper.unmount()
  })

  it('permite substituir o preço sem apagar o símbolo da moeda', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories, initialValues: existingProduct },
    })

    await setPrice(wrapper, 10.5)

    const priceInput = wrapper.get('#product-price').element as HTMLInputElement
    expect(priceInput.value).toBe(formatPriceInput(10.5, 'pt-BR'))
    expect(priceInput.value).not.toContain('R$')
    expect(normalizeSpaces(wrapper.text())).toContain(
      normalizeSpaces(formatPrice(10.5, 'pt-BR')),
    )

    await submitForm(wrapper)
    expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({ price: 10.5 })
  })

  it('permite edição parcial mantendo o valor numérico no model', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories, initialValues: existingProduct },
    })

    await setPrice(wrapper, 17.95)

    expect((wrapper.get('#product-price').element as HTMLInputElement).value).toBe(
      formatPriceInput(17.95, 'pt-BR'),
    )

    await submitForm(wrapper)
    expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({ price: 17.95 })
  })

  it('reposiciona o símbolo ao trocar locale sem alterar o preço numérico', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories, initialValues: existingProduct },
    })

    expect(wrapper.text()).toContain(getCurrencyAffix('pt-BR').symbol)

    i18n.global.locale.value = 'en'
    await nextTick()
    expect((wrapper.get('#product-price').element as HTMLInputElement).value).toBe(
      formatPriceInput(existingPrice, 'en'),
    )
    expect(wrapper.text()).toContain(getCurrencyAffix('en').symbol)
    expect((wrapper.get('#product-price').element as HTMLInputElement).value).not.toContain('$')

    i18n.global.locale.value = 'es'
    await nextTick()
    expect((wrapper.get('#product-price').element as HTMLInputElement).value).toBe(
      formatPriceInput(existingPrice, 'es'),
    )
    expect(wrapper.text()).toContain(getCurrencyAffix('es').symbol)
    expect((wrapper.get('#product-price').element as HTMLInputElement).value).not.toContain('€')

    await submitForm(wrapper)
    expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({ price: existingPrice })
  })

  it('foca o campo título ao montar o formulário', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories },
      attachTo: document.body,
    })

    await flushPromises()
    await nextTick()

    expect(document.activeElement).toBe(wrapper.get('#product-title').element)
    wrapper.unmount()
  })
})
