<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useImageZoom } from '@/composables/useImageZoom'
import { IMAGE_ZOOM_SCALE } from '@/utils/imageZoom'

defineProps<{
  src: string
  alt: string
}>()

const emit = defineEmits<{
  error: []
}>()

const frameRef = ref<HTMLElement | null>(null)
const { isZoomed, onPointerEnter, onPointerMove, onPointerLeave, onPointerCancel } =
  useImageZoom(frameRef)

onMounted(() => {
  frameRef.value?.style.setProperty('--zoom-scale', String(IMAGE_ZOOM_SCALE))
})

function onImageError(): void {
  emit('error')
}
</script>

<template>
  <div
    ref="frameRef"
    class="product-image-zoom relative max-h-52 w-full max-w-full overflow-hidden sm:max-h-72 lg:max-h-80"
    :class="{ 'is-zoomed': isZoomed }"
    data-testid="product-image-zoom"
    :data-zoomed="isZoomed ? 'true' : 'false'"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    @pointercancel="onPointerCancel"
  >
    <img
      :src="src"
      :alt="alt"
      class="product-image-zoom__image mx-auto block max-h-52 w-full max-w-full object-contain select-none sm:max-h-72 lg:max-h-80"
      width="320"
      height="320"
      draggable="false"
      @error="onImageError"
      @dragstart.prevent
    />
  </div>
</template>

<style scoped>
.product-image-zoom {
  --zoom-x: 50%;
  --zoom-y: 50%;
  --zoom-scale: 2.4;
}

.product-image-zoom__image {
  transform-origin: var(--zoom-x) var(--zoom-y);
  transform: scale(1);
  transition: transform 150ms ease-out;
}

.product-image-zoom.is-zoomed .product-image-zoom__image {
  transform: scale(var(--zoom-scale));
  will-change: transform;
}

@media (hover: hover) and (pointer: fine) {
  .product-image-zoom {
    cursor: zoom-in;
  }
}
</style>
