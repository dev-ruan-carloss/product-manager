import { onScopeDispose, ref, type Ref } from 'vue'

import {
  getRelativePointerPercent,
  IMAGE_ZOOM_DEFAULT_PERCENT,
  isMousePointerType,
} from '@/utils/imageZoom'

export const ZOOM_ORIGIN_X_VAR = '--zoom-x'
export const ZOOM_ORIGIN_Y_VAR = '--zoom-y'

function writeOrigin(frame: HTMLElement | null, x: number, y: number): void {
  if (!frame) {
    return
  }

  frame.style.setProperty(ZOOM_ORIGIN_X_VAR, `${x}%`)
  frame.style.setProperty(ZOOM_ORIGIN_Y_VAR, `${y}%`)
}

/**
 * Zoom in-place da imagem do detalhe: origem via ponteiro + CSS variables.
 * Apenas ponteiro mouse; touch permanece no estado normal.
 */
export function useImageZoom(frameRef: Ref<HTMLElement | null>) {
  const isZoomed = ref(false)
  let rafId = 0
  let pendingX = IMAGE_ZOOM_DEFAULT_PERCENT
  let pendingY = IMAGE_ZOOM_DEFAULT_PERCENT

  function cancelScheduledFrame(): void {
    if (rafId === 0) {
      return
    }

    cancelAnimationFrame(rafId)
    rafId = 0
  }

  function flushOrigin(): void {
    rafId = 0
    writeOrigin(frameRef.value, pendingX, pendingY)
  }

  function scheduleOrigin(x: number, y: number): void {
    pendingX = x
    pendingY = y

    if (rafId !== 0) {
      return
    }

    rafId = requestAnimationFrame(flushOrigin)
  }

  function originFromEvent(event: PointerEvent): { x: number; y: number } {
    const frame = frameRef.value
    if (!frame) {
      return { x: IMAGE_ZOOM_DEFAULT_PERCENT, y: IMAGE_ZOOM_DEFAULT_PERCENT }
    }

    return getRelativePointerPercent(event.clientX, event.clientY, frame.getBoundingClientRect())
  }

  function onPointerEnter(event: PointerEvent): void {
    if (!isMousePointerType(event.pointerType)) {
      return
    }

    const { x, y } = originFromEvent(event)
    cancelScheduledFrame()
    writeOrigin(frameRef.value, x, y)
    isZoomed.value = true
  }

  function onPointerMove(event: PointerEvent): void {
    if (!isMousePointerType(event.pointerType) || !isZoomed.value) {
      return
    }

    const { x, y } = originFromEvent(event)
    scheduleOrigin(x, y)
  }

  function deactivate(): void {
    cancelScheduledFrame()
    isZoomed.value = false
    writeOrigin(frameRef.value, IMAGE_ZOOM_DEFAULT_PERCENT, IMAGE_ZOOM_DEFAULT_PERCENT)
  }

  function onPointerLeave(event: PointerEvent): void {
    if (!isMousePointerType(event.pointerType)) {
      return
    }

    deactivate()
  }

  function onPointerCancel(): void {
    if (!isZoomed.value) {
      return
    }

    deactivate()
  }

  onScopeDispose(() => {
    cancelScheduledFrame()
    isZoomed.value = false
  })

  return {
    isZoomed,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    onPointerCancel,
  }
}
