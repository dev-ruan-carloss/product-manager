import { describe, expect, it } from 'vitest'

import {
  clampZoomPercent,
  getRelativePointerPercent,
  IMAGE_ZOOM_DEFAULT_PERCENT,
  IMAGE_ZOOM_MAX_PERCENT,
  IMAGE_ZOOM_MIN_PERCENT,
  isMousePointerType,
} from '@/utils/imageZoom'

describe('imageZoom', () => {
  it('mantém valores dentro de 0% e 100%', () => {
    expect(clampZoomPercent(-20)).toBe(IMAGE_ZOOM_MIN_PERCENT)
    expect(clampZoomPercent(0)).toBe(0)
    expect(clampZoomPercent(47.5)).toBe(47.5)
    expect(clampZoomPercent(100)).toBe(IMAGE_ZOOM_MAX_PERCENT)
    expect(clampZoomPercent(140)).toBe(IMAGE_ZOOM_MAX_PERCENT)
  })

  it('usa o centro quando o valor não é finito', () => {
    expect(clampZoomPercent(Number.NaN)).toBe(IMAGE_ZOOM_DEFAULT_PERCENT)
    expect(clampZoomPercent(Number.POSITIVE_INFINITY)).toBe(IMAGE_ZOOM_DEFAULT_PERCENT)
    expect(clampZoomPercent(Number.NEGATIVE_INFINITY)).toBe(IMAGE_ZOOM_DEFAULT_PERCENT)
  })

  it('calcula a posição relativa do ponteiro em porcentagem', () => {
    const rect = { left: 100, top: 50, width: 200, height: 100 }

    expect(getRelativePointerPercent(100, 50, rect)).toEqual({ x: 0, y: 0 })
    expect(getRelativePointerPercent(200, 100, rect)).toEqual({ x: 50, y: 50 })
    expect(getRelativePointerPercent(300, 150, rect)).toEqual({ x: 100, y: 100 })
  })

  it('limita a origem quando o ponteiro sai da área da imagem', () => {
    const rect = { left: 0, top: 0, width: 100, height: 100 }

    expect(getRelativePointerPercent(-40, -10, rect)).toEqual({ x: 0, y: 0 })
    expect(getRelativePointerPercent(180, 250, rect)).toEqual({ x: 100, y: 100 })
  })

  it('usa o centro quando a imagem não tem dimensões utilizáveis', () => {
    expect(getRelativePointerPercent(10, 10, { left: 0, top: 0, width: 0, height: 0 })).toEqual({
      x: IMAGE_ZOOM_DEFAULT_PERCENT,
      y: IMAGE_ZOOM_DEFAULT_PERCENT,
    })
    expect(getRelativePointerPercent(10, 10, { left: 0, top: 0, width: -8, height: 40 })).toEqual({
      x: IMAGE_ZOOM_DEFAULT_PERCENT,
      y: IMAGE_ZOOM_DEFAULT_PERCENT,
    })
    expect(
      getRelativePointerPercent(10, 10, { left: 0, top: 0, width: Number.NaN, height: 40 }),
    ).toEqual({
      x: IMAGE_ZOOM_DEFAULT_PERCENT,
      y: IMAGE_ZOOM_DEFAULT_PERCENT,
    })
  })

  it('reconhece apenas ponteiro mouse para o zoom por hover', () => {
    expect(isMousePointerType('mouse')).toBe(true)
    expect(isMousePointerType('touch')).toBe(false)
    expect(isMousePointerType('pen')).toBe(false)
    expect(isMousePointerType('')).toBe(false)
  })
})
