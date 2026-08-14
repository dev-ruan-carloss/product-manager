import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: vi.fn() }),
}))

vi.mock('@/services/productService', () => ({
  productService: {
    getProducts: vi.fn(),
    getCategories: vi.fn(),
  },
}))

import { resetProductsCatalogState, useProductsCatalog } from '@/composables/useProductsCatalog'
import { productService } from '@/services/productService'
import { FAVORITES_STORAGE_KEY, useFavoritesStore } from '@/stores/favoritesStore'
import FavoritosView from '@/views/FavoritosView.vue'
import { makeProduct } from '../helpers/makeProduct'
import { mountWithApp } from '../helpers/mountComponent'

describe('FavoritosView', () => {
  beforeEach(() => {
    localStorage.clear()
    resetProductsCatalogState()
    vi.clearAllMocks()
  })

  afterEach(() => {
    resetProductsCatalogState()
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('exibe produto existente da API favoritado após reload', async () => {
    const product = makeProduct({ id: 1, title: 'Produto persistido' })
    vi.mocked(productService.getProducts).mockResolvedValue([product])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([1]))

    const { wrapper } = await mountWithApp(FavoritosView, { route: '/favoritos' })
    await flushPromises()

    expect(wrapper.text()).toContain('Produto persistido')
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('produto favoritado')
    expect(wrapper.text()).not.toContain('Você ainda não possui favoritos.')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('mostra lista vazia sem erro quando o favorito armazenado ficou órfão', async () => {
    vi.mocked(productService.getProducts).mockResolvedValue([makeProduct({ id: 1 })])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([21]))

    const { wrapper } = await mountWithApp(FavoritosView, { route: '/favoritos' })
    await flushPromises()

    expect(wrapper.text()).toContain('Você ainda não possui favoritos.')
    expect(wrapper.text()).not.toContain('Nenhum favorito disponível no momento.')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('produto favoritado')
    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]')).toEqual([])
    wrapper.unmount()
  })

  it('exibe somente os favoritos que ainda existem no catálogo', async () => {
    vi.mocked(productService.getProducts).mockResolvedValue([
      makeProduct({ id: 1, title: 'Produto um' }),
      makeProduct({ id: 7, title: 'Produto sete' }),
    ])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([1, 7, 999]))

    const { wrapper } = await mountWithApp(FavoritosView, { route: '/favoritos' })
    await flushPromises()

    expect(wrapper.text()).toContain('Produto um')
    expect(wrapper.text()).toContain('Produto sete')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('produtos favoritados')
    expect(wrapper.text()).not.toContain('não está mais disponível')
    wrapper.unmount()
  })

  it('mostra produto criado na sessão quando ele ainda está no catálogo', async () => {
    vi.mocked(productService.getProducts).mockResolvedValue([makeProduct({ id: 1 })])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])

    const { wrapper, pinia } = await mountWithApp(FavoritosView, { route: '/favoritos' })
    await flushPromises()

    const created = makeProduct({ id: 21, title: 'Criado agora' })
    useProductsCatalog({ autoLoad: false }).addCreatedProduct(created)
    useFavoritesStore(pinia).addFavorite(21)
    await flushPromises()

    expect(wrapper.text()).toContain('Criado agora')
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('produto favoritado')
    wrapper.unmount()
  })

  it('não antecipa contador nem erro enquanto o catálogo resolve IDs órfãos', async () => {
    let resolveProducts!: (value: ReturnType<typeof makeProduct>[]) => void
    vi.mocked(productService.getProducts).mockReturnValue(
      new Promise((resolve) => {
        resolveProducts = resolve
      }),
    )
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([21]))

    const { wrapper } = await mountWithApp(FavoritosView, { route: '/favoritos' })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('1 produto favoritado')
    expect(wrapper.text()).not.toContain('Você ainda não possui favoritos.')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)

    resolveProducts([makeProduct({ id: 1 })])
    await flushPromises()

    expect(wrapper.text()).toContain('Você ainda não possui favoritos.')
    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(false)
    wrapper.unmount()
  })
})
