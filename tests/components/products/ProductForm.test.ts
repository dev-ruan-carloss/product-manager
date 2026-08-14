import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import ProductForm from '@/components/products/ProductForm.vue'
import { i18n } from '@/i18n'
import {
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_PRICE_MAX,
  PRODUCT_TITLE_MAX_LENGTH,
} from '@/schemas/productFormLimits'
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
      'product-title-message product-title-counter',
    )
    expect(wrapper.get('#product-title').attributes('maxlength')).toBe(
      String(PRODUCT_TITLE_MAX_LENGTH),
    )
    expect(wrapper.get('#product-description').attributes('maxlength')).toBe(
      String(PRODUCT_DESCRIPTION_MAX_LENGTH),
    )
    expect(wrapper.get('#product-title-counter').text()).toContain(`0/${PRODUCT_TITLE_MAX_LENGTH}`)
    expect(wrapper.get('#product-description-counter').text()).toContain(
      `0/${PRODUCT_DESCRIPTION_MAX_LENGTH}`,
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
    expect(titleInput.attributes('aria-describedby')).toBe(
      'product-title-message product-title-counter',
    )
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

  it('impede submit com título ou descrição só de espaços', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: {
        categories,
        initialValues: {
          ...validValues,
          title: '     ',
          description: '     ',
        },
      },
    })

    await submitForm(wrapper)

    expect(wrapper.get('#product-title-message').text()).toBe('O título é obrigatório.')
    expect(wrapper.get('#product-description-message').text()).toBe('A descrição é obrigatória.')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('aceita título e descrição exatamente no limite na criação', async () => {
    const atLimit: ProductFormData = {
      ...validValues,
      title: 'T'.repeat(PRODUCT_TITLE_MAX_LENGTH),
      description: 'D'.repeat(PRODUCT_DESCRIPTION_MAX_LENGTH),
      price: 10.5,
    }

    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories, initialValues: atLimit },
    })

    expect(wrapper.get('#product-title-counter').text()).toContain(
      `${PRODUCT_TITLE_MAX_LENGTH}/${PRODUCT_TITLE_MAX_LENGTH}`,
    )
    expect(wrapper.get('#product-description-counter').text()).toContain(
      `${PRODUCT_DESCRIPTION_MAX_LENGTH}/${PRODUCT_DESCRIPTION_MAX_LENGTH}`,
    )

    await submitForm(wrapper)
    expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({
      title: atLimit.title,
      description: atLimit.description,
      price: 10.5,
    })
  })

  it('aceita valores no limite na edição, incluindo preço máximo e duas casas', async () => {
    const existingAtLimit: ProductFormData = {
      title: 'E'.repeat(PRODUCT_TITLE_MAX_LENGTH),
      description: 'E'.repeat(PRODUCT_DESCRIPTION_MAX_LENGTH),
      price: PRODUCT_PRICE_MAX,
      category: 'electronics',
      image: 'https://example.com/existing.jpg',
    }

    const { wrapper } = await mountWithApp(ProductForm, {
      props: {
        categories,
        initialValues: existingAtLimit,
        submitLabel: 'Salvar Alterações',
      },
    })

    const priceInput = wrapper.get('#product-price').element as HTMLInputElement
    expect(priceInput.value).toBe(formatPriceInput(PRODUCT_PRICE_MAX, 'pt-BR'))

    await submitForm(wrapper)
    expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({
      title: existingAtLimit.title,
      description: existingAtLimit.description,
      price: PRODUCT_PRICE_MAX,
      category: 'electronics',
      image: existingAtLimit.image,
    })
  })

  it('não envia preço com três casas decimais e exibe a validação', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories, initialValues: existingProduct },
    })

    const input = wrapper.get('#product-price')
    await input.setValue('10,999')
    await input.trigger('blur')
    await nextTick()
    await submitForm(wrapper)

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.get('#product-price-message').text()).toBe(
      String(i18n.global.t('validation.priceDecimals')),
    )
    expect(wrapper.get('#product-price').attributes('aria-invalid')).toBe('true')
  })

  it('não envia preço acima do máximo e exibe a validação', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories, initialValues: existingProduct },
    })

    const input = wrapper.get('#product-price')
    await input.setValue(formatPriceInput(1_000_000, 'pt-BR'))
    await input.trigger('blur')
    await nextTick()
    await submitForm(wrapper)

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.get('#product-price-message').text()).toBe(
      String(i18n.global.t('validation.priceMax', { max: formatPrice(PRODUCT_PRICE_MAX) })),
    )
  })

  it('envia payload normalizado na criação e na edição', async () => {
    const createMount = await mountWithApp(ProductForm, {
      props: { categories, initialValues: validValues },
    })
    await submitForm(createMount.wrapper)
    expect(createMount.wrapper.emitted('submit')?.[0]?.[0]).toEqual({
      title: validValues.title,
      price: validValues.price,
      description: validValues.description,
      category: validValues.category,
      image: validValues.image,
    })
    expect(typeof createMount.wrapper.emitted('submit')?.[0]?.[0]).toBe('object')
    expect(typeof (createMount.wrapper.emitted('submit')?.[0]?.[0] as { price: number }).price).toBe(
      'number',
    )

    const editMount = await mountWithApp(ProductForm, {
      props: {
        categories,
        initialValues: existingProduct,
        submitLabel: 'Salvar Alterações',
      },
    })
    await submitForm(editMount.wrapper)
    expect(editMount.wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({
      title: existingProduct.title,
      price: existingPrice,
      description: existingProduct.description,
    })
  })

  it('associa o contador de caracteres ao campo para leitores de tela', async () => {
    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories, initialValues: validValues },
    })

    expect(wrapper.get('#product-title').attributes('aria-describedby')).toContain(
      'product-title-counter',
    )
    expect(wrapper.get('#product-description').attributes('aria-describedby')).toContain(
      'product-description-counter',
    )
    expect(wrapper.get('#product-title-counter').text()).toContain(
      String(i18n.global.t('form.characterCountAria', {
        current: validValues.title.length,
        max: PRODUCT_TITLE_MAX_LENGTH,
      })),
    )
  })
})
