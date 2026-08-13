import { mount, type ComponentMountingOptions, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { createMemoryHistory, createRouter, type Router, type RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'

import { i18n } from '@/i18n'

const stubRoutes: RouteRecordRaw[] = [
  { path: '/', redirect: '/produtos' },
  { path: '/produtos', name: 'produtos', component: { template: '<div />' } },
  { path: '/produtos/novo', name: 'produto-criar', component: { template: '<div />' } },
  { path: '/produtos/:id/editar', name: 'produto-editar', component: { template: '<div />' } },
  { path: '/produtos/:id', name: 'produto-detalhes', component: { template: '<div />' } },
  { path: '/favoritos', name: 'favoritos', component: { template: '<div />' } },
]

/** jsdom não implementa matchMedia; PrimeVue/themeStore dependem dele. */
export function ensureMatchMedia(): void {
  if (typeof window.matchMedia === 'function') {
    return
  }

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  })
}

ensureMatchMedia()

/** jsdom não implementa ResizeObserver; Textarea do PrimeVue depende dele. */
export function ensureResizeObserver(): void {
  if (typeof window.ResizeObserver === 'function') {
    return
  }

  class ResizeObserverStub {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: ResizeObserverStub,
  })
}

ensureResizeObserver()

export async function createTestRouter(initialRoute = '/produtos'): Promise<Router> {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: stubRoutes,
  })
  await router.push(initialRoute)
  await router.isReady()
  return router
}

export function createTestPinia(): Pinia {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

export function resetAppLocale(): void {
  i18n.global.locale.value = 'pt-BR'
}

type MountOptions<C> = ComponentMountingOptions<C> & {
  route?: string
  pinia?: Pinia
  router?: Router
}

/**
 * Monta um componente com Pinia, vue-i18n, Vue Router e PrimeVue —
 * o mesmo conjunto de plugins usado pela aplicação.
 */
export async function mountWithApp<C>(
  component: C,
  options: MountOptions<C> = {},
): Promise<{
  wrapper: VueWrapper
  router: Router
  pinia: Pinia
}> {
  resetAppLocale()

  const pinia = options.pinia ?? createTestPinia()
  const router = options.router ?? (await createTestRouter(options.route ?? '/produtos'))
  const { route, pinia: piniaOption, router: routerOption, global, ...rest } = options
  void route
  void piniaOption
  void routerOption

  const wrapper = mount(component as Component, {
    ...rest,
    global: {
      ...global,
      plugins: [pinia, i18n, router, PrimeVue, ...(global?.plugins ?? [])],
    },
  })

  return { wrapper, router, pinia }
}

/**
 * Invoca o handler Vue `@submit` do formulário.
 * Necessário porque jsdom/`trigger('submit')` não aciona de forma
 * confiável o invoker de evento do Vue 3 neste setup (PrimeVue + VTU).
 */
export async function invokeFormSubmit(wrapper: VueWrapper, selector = 'form'): Promise<void> {
  const form = wrapper.get(selector).element as HTMLFormElement & {
    __vnode?: { props?: { onSubmit?: (event: Event) => unknown } }
  }

  const onSubmit = form.__vnode?.props?.onSubmit
  if (typeof onSubmit !== 'function') {
    throw new Error(`Formulário "${selector}" sem handler onSubmit no vnode`)
  }

  await onSubmit(new Event('submit', { bubbles: true, cancelable: true }))
}
