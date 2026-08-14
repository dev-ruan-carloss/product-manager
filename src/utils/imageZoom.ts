export const IMAGE_ZOOM_MIN_PERCENT = 0
export const IMAGE_ZOOM_MAX_PERCENT = 100
export const IMAGE_ZOOM_DEFAULT_PERCENT = 50
/** Escala aplicada no detalhe; o CSS do componente usa o mesmo valor. */
export const IMAGE_ZOOM_SCALE = 2.4

export type ZoomOriginPercent = {
  x: number
  y: number
}

export function clampZoomPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return IMAGE_ZOOM_DEFAULT_PERCENT
  }

  return Math.min(IMAGE_ZOOM_MAX_PERCENT, Math.max(IMAGE_ZOOM_MIN_PERCENT, value))
}

export function getRelativePointerPercent(
  clientX: number,
  clientY: number,
  rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
): ZoomOriginPercent {
  if (!Number.isFinite(rect.width) || !Number.isFinite(rect.height) || rect.width <= 0 || rect.height <= 0) {
    return { x: IMAGE_ZOOM_DEFAULT_PERCENT, y: IMAGE_ZOOM_DEFAULT_PERCENT }
  }

  return {
    x: clampZoomPercent(((clientX - rect.left) / rect.width) * 100),
    y: clampZoomPercent(((clientY - rect.top) / rect.height) * 100),
  }
}

export function isMousePointerType(pointerType: string): boolean {
  return pointerType === 'mouse'
}
