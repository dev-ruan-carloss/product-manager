import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import ProductImageZoom from '@/components/products/ProductImageZoom.vue'
import { ZOOM_ORIGIN_X_VAR, ZOOM_ORIGIN_Y_VAR } from '@/composables/useImageZoom'
import { mountWithApp } from '../../helpers/mountComponent'

function stubFrameRect(element: HTMLElement, rect: Partial<DOMRect> = {}): void {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    right: 200,
    bottom: 200,
    toJSON() {
      return {}
    },
    ...rect,
  } as DOMRect)
}

async function dispatchPointer(
  element: HTMLElement,
  type: string,
  init: PointerEventInit,
): Promise<void> {
  element.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      ...init,
    }),
  )
  await nextTick()
}

async function nextAnimationFrame(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

describe('ProductImageZoom', () => {
  it('renderiza a imagem sem zoom no estado inicial', async () => {
    const { wrapper } = await mountWithApp(ProductImageZoom, {
      props: { src: 'https://example.com/product.png', alt: 'Mochila Fjallraven' },
    })

    const frame = wrapper.get('[data-testid="product-image-zoom"]')
    expect(frame.attributes('data-zoomed')).toBe('false')
    expect(frame.classes()).not.toContain('is-zoomed')
    expect(wrapper.get('img').attributes('alt')).toBe('Mochila Fjallraven')
    expect(wrapper.get('img').attributes('src')).toBe('https://example.com/product.png')
  })

  it('ativa o zoom no pointerenter do mouse e acompanha o movimento', async () => {
    const { wrapper } = await mountWithApp(ProductImageZoom, {
      props: { src: 'https://example.com/product.png', alt: 'Produto' },
    })

    const frame = wrapper.get('[data-testid="product-image-zoom"]')
    stubFrameRect(frame.element as HTMLElement)

    await dispatchPointer(frame.element as HTMLElement, 'pointerenter', {
      pointerType: 'mouse',
      clientX: 50,
      clientY: 50,
    })
    expect(frame.attributes('data-zoomed')).toBe('true')
    expect(frame.classes()).toContain('is-zoomed')
    expect((frame.element as HTMLElement).style.getPropertyValue(ZOOM_ORIGIN_X_VAR)).toBe('25%')

    await dispatchPointer(frame.element as HTMLElement, 'pointermove', {
      pointerType: 'mouse',
      clientX: 150,
      clientY: 100,
    })
    await nextAnimationFrame()
    expect((frame.element as HTMLElement).style.getPropertyValue(ZOOM_ORIGIN_X_VAR)).toBe('75%')
    expect((frame.element as HTMLElement).style.getPropertyValue(ZOOM_ORIGIN_Y_VAR)).toBe('50%')
  })

  it('volta ao estado normal no pointerleave', async () => {
    const { wrapper } = await mountWithApp(ProductImageZoom, {
      props: { src: 'https://example.com/product.png', alt: 'Produto' },
    })

    const frame = wrapper.get('[data-testid="product-image-zoom"]')
    stubFrameRect(frame.element as HTMLElement)

    await dispatchPointer(frame.element as HTMLElement, 'pointerenter', {
      pointerType: 'mouse',
      clientX: 80,
      clientY: 80,
    })
    await dispatchPointer(frame.element as HTMLElement, 'pointerleave', {
      pointerType: 'mouse',
      clientX: 80,
      clientY: 80,
    })

    expect(frame.attributes('data-zoomed')).toBe('false')
    expect(frame.classes()).not.toContain('is-zoomed')
  })

  it('não ativa zoom com ponteiro touch', async () => {
    const { wrapper } = await mountWithApp(ProductImageZoom, {
      props: { src: 'https://example.com/product.png', alt: 'Produto' },
    })

    const frame = wrapper.get('[data-testid="product-image-zoom"]')
    stubFrameRect(frame.element as HTMLElement)

    await dispatchPointer(frame.element as HTMLElement, 'pointerenter', {
      pointerType: 'touch',
      clientX: 80,
      clientY: 80,
    })
    await dispatchPointer(frame.element as HTMLElement, 'pointermove', {
      pointerType: 'touch',
      clientX: 120,
      clientY: 120,
    })

    expect(frame.attributes('data-zoomed')).toBe('false')
    expect(frame.classes()).not.toContain('is-zoomed')
  })

  it('emite error quando a imagem falha e preserva o alt até o fallback do pai', async () => {
    const { wrapper } = await mountWithApp(ProductImageZoom, {
      props: { src: 'https://example.com/missing.png', alt: 'Título do produto' },
    })

    await wrapper.get('img').trigger('error')
    expect(wrapper.emitted('error')).toHaveLength(1)
    expect(wrapper.get('img').attributes('alt')).toBe('Título do produto')
  })

  it('não quebra quando o frame ainda não tem dimensões', async () => {
    const { wrapper } = await mountWithApp(ProductImageZoom, {
      props: { src: 'https://example.com/product.png', alt: 'Produto' },
    })

    const frame = wrapper.get('[data-testid="product-image-zoom"]')
    stubFrameRect(frame.element as HTMLElement, { width: 0, height: 0, right: 0, bottom: 0 })

    await dispatchPointer(frame.element as HTMLElement, 'pointerenter', {
      pointerType: 'mouse',
      clientX: 10,
      clientY: 10,
    })

    expect(frame.attributes('data-zoomed')).toBe('true')
    expect((frame.element as HTMLElement).style.getPropertyValue(ZOOM_ORIGIN_X_VAR)).toBe('50%')
  })

  it('limpa o zoom ao desmontar', async () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      void callback
      return 77
    })
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame')
    const { wrapper } = await mountWithApp(ProductImageZoom, {
      props: { src: 'https://example.com/product.png', alt: 'Produto' },
    })

    const frame = wrapper.get('[data-testid="product-image-zoom"]')
    stubFrameRect(frame.element as HTMLElement)
    await dispatchPointer(frame.element as HTMLElement, 'pointerenter', {
      pointerType: 'mouse',
      clientX: 40,
      clientY: 40,
    })
    await dispatchPointer(frame.element as HTMLElement, 'pointermove', {
      pointerType: 'mouse',
      clientX: 90,
      clientY: 90,
    })

    wrapper.unmount()
    await nextTick()

    expect(cancelSpy).toHaveBeenCalledWith(77)
  })
})
