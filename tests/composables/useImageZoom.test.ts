import { effectScope, ref, type EffectScope } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useImageZoom, ZOOM_ORIGIN_X_VAR, ZOOM_ORIGIN_Y_VAR } from '@/composables/useImageZoom'
import { IMAGE_ZOOM_DEFAULT_PERCENT } from '@/utils/imageZoom'

function createFrame(rect: Partial<DOMRect> = {}): HTMLElement {
  const el = document.createElement('div')
  document.body.appendChild(el)
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
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
  return el
}

function mousePointer(clientX: number, clientY: number): PointerEvent {
  return new PointerEvent('pointermove', {
    pointerType: 'mouse',
    clientX,
    clientY,
    bubbles: true,
  })
}

function touchPointer(clientX: number, clientY: number): PointerEvent {
  return new PointerEvent('pointermove', {
    pointerType: 'touch',
    clientX,
    clientY,
    bubbles: true,
  })
}

async function nextAnimationFrame(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

describe('useImageZoom', () => {
  let scope: EffectScope
  let frame: HTMLElement

  beforeEach(() => {
    scope = effectScope()
    frame = createFrame()
  })

  afterEach(() => {
    scope.stop()
    frame.remove()
  })

  it('inicia sem zoom e com origem no centro', () => {
    const frameRef = ref<HTMLElement | null>(frame)
    const zoom = scope.run(() => useImageZoom(frameRef))!

    expect(zoom.isZoomed.value).toBe(false)
    expect(frame.style.getPropertyValue(ZOOM_ORIGIN_X_VAR)).toBe('')
  })

  it('ativa o zoom na entrada do mouse e posiciona a origem', () => {
    const frameRef = ref<HTMLElement | null>(frame)
    const zoom = scope.run(() => useImageZoom(frameRef))!

    zoom.onPointerEnter(mousePointer(50, 150))

    expect(zoom.isZoomed.value).toBe(true)
    expect(frame.style.getPropertyValue(ZOOM_ORIGIN_X_VAR)).toBe('25%')
    expect(frame.style.getPropertyValue(ZOOM_ORIGIN_Y_VAR)).toBe('75%')
  })

  it('atualiza a origem no movimento do mouse via animation frame', async () => {
    const frameRef = ref<HTMLElement | null>(frame)
    const zoom = scope.run(() => useImageZoom(frameRef))!

    zoom.onPointerEnter(mousePointer(0, 0))
    zoom.onPointerMove(mousePointer(200, 100))
    await nextAnimationFrame()

    expect(frame.style.getPropertyValue(ZOOM_ORIGIN_X_VAR)).toBe('100%')
    expect(frame.style.getPropertyValue(ZOOM_ORIGIN_Y_VAR)).toBe('50%')
  })

  it('limita a origem a 0% e 100% quando o ponteiro ultrapassa o elemento', async () => {
    const frameRef = ref<HTMLElement | null>(frame)
    const zoom = scope.run(() => useImageZoom(frameRef))!

    zoom.onPointerEnter(mousePointer(100, 100))
    zoom.onPointerMove(mousePointer(-80, 400))
    await nextAnimationFrame()

    expect(frame.style.getPropertyValue(ZOOM_ORIGIN_X_VAR)).toBe('0%')
    expect(frame.style.getPropertyValue(ZOOM_ORIGIN_Y_VAR)).toBe('100%')
  })

  it('desativa o zoom ao sair com o mouse e restaura a origem', () => {
    const frameRef = ref<HTMLElement | null>(frame)
    const zoom = scope.run(() => useImageZoom(frameRef))!

    zoom.onPointerEnter(mousePointer(40, 40))
    zoom.onPointerLeave(mousePointer(40, 40))

    expect(zoom.isZoomed.value).toBe(false)
    expect(frame.style.getPropertyValue(ZOOM_ORIGIN_X_VAR)).toBe(`${IMAGE_ZOOM_DEFAULT_PERCENT}%`)
    expect(frame.style.getPropertyValue(ZOOM_ORIGIN_Y_VAR)).toBe(`${IMAGE_ZOOM_DEFAULT_PERCENT}%`)
  })

  it('ignora ponteiro touch e não ativa o zoom', () => {
    const frameRef = ref<HTMLElement | null>(frame)
    const zoom = scope.run(() => useImageZoom(frameRef))!

    zoom.onPointerEnter(touchPointer(80, 80))
    zoom.onPointerMove(touchPointer(120, 120))

    expect(zoom.isZoomed.value).toBe(false)
    expect(frame.style.getPropertyValue(ZOOM_ORIGIN_X_VAR)).toBe('')
  })

  it('usa o centro quando o elemento não tem dimensões', () => {
    frame.remove()
    frame = createFrame({ width: 0, height: 0, right: 0, bottom: 0 })
    const frameRef = ref<HTMLElement | null>(frame)
    const zoom = scope.run(() => useImageZoom(frameRef))!

    zoom.onPointerEnter(mousePointer(40, 40))

    expect(zoom.isZoomed.value).toBe(true)
    expect(frame.style.getPropertyValue(ZOOM_ORIGIN_X_VAR)).toBe(`${IMAGE_ZOOM_DEFAULT_PERCENT}%`)
    expect(frame.style.getPropertyValue(ZOOM_ORIGIN_Y_VAR)).toBe(`${IMAGE_ZOOM_DEFAULT_PERCENT}%`)
  })

  it('cancela o animation frame pendente ao desmontar', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      void callback
      return 99
    })
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame')
    const frameRef = ref<HTMLElement | null>(frame)
    const zoom = scope.run(() => useImageZoom(frameRef))!

    zoom.onPointerEnter(mousePointer(10, 10))
    zoom.onPointerMove(mousePointer(80, 80))
    scope.stop()

    expect(cancelSpy).toHaveBeenCalledWith(99)
    expect(zoom.isZoomed.value).toBe(false)
  })
})
