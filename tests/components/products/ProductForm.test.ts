import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import ProductForm from '@/components/products/ProductForm.vue'
import type { ProductFormData } from '@/types/productForm'
import { invokeFormSubmit, mountWithApp } from '../../helpers/mountComponent'

const categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"]

const validValues: ProductFormData = {
  title: 'Fjallraven Backpack',
  price: 109.95,
  description: 'Your perfect pack for everyday use and walks in the forest.',
  category: "men's clothing",
  image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
}

async function submitForm(
  wrapper: Awaited<ReturnType<typeof mountWithApp>>['wrapper'],
): Promise<void> {
  await invokeFormSubmit(wrapper)
  await flushPromises()
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
