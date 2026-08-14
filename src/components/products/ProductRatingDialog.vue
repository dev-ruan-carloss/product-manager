<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'

import { isUserRatingValue, USER_RATING_VALUES, type UserRatingValue } from '@/types/product'

const props = defineProps<{
  visible: boolean
  initialRating?: UserRatingValue
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: [rating: UserRatingValue]
}>()

const { t } = useI18n()
const selected = ref<UserRatingValue | null>(null)
const hovered = ref<UserRatingValue | null>(null)
const starRefs = ref<Array<HTMLButtonElement | null>>([])

const canConfirm = computed(() => selected.value !== null)

const previewValue = computed(() => hovered.value ?? selected.value)

const starsGroupAria = computed(() => {
  if (selected.value === null) {
    return `${t('rating.starsGroupAria')}. ${t('rating.selectedNoneAria')}`
  }

  if (selected.value === 1) {
    return `${t('rating.starsGroupAria')}. ${t('rating.selectedOneAria')}`
  }

  return `${t('rating.starsGroupAria')}. ${t('rating.selectedManyAria', { count: selected.value })}`
})

const selectedLabel = computed(() => {
  if (previewValue.value === null) {
    return t('rating.selectedNoneAria')
  }

  return previewValue.value === 1
    ? t('rating.starOne')
    : t('rating.starMany', { count: previewValue.value })
})

const dialogPt = {
  root: {
    class:
      'w-[min(100%,26rem)] max-[450px]:w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-950',
  },
  header: {
    class:
      'mb-0 items-start border-b border-slate-100 px-5 py-4 dark:border-slate-800',
  },
  title: {
    class: 'w-full',
  },
  headerActions: {
    class: 'self-start',
  },
  content: {
    class: 'px-5 !pt-3 pb-3',
  },
  footer: {
    class:
      'border-t border-slate-100 px-5 !pt-3 pb-4 dark:border-slate-800',
  },
}

function starLabel(star: UserRatingValue): string {
  return star === 1 ? t('rating.starOne') : t('rating.starMany', { count: star })
}

function isFilled(star: UserRatingValue): boolean {
  return previewValue.value !== null && star <= previewValue.value
}

function tabIndexFor(star: UserRatingValue): number {
  if (selected.value === star) {
    return 0
  }

  if (selected.value === null && star === 1) {
    return 0
  }

  return -1
}

function setStarRef(el: unknown, star: UserRatingValue): void {
  starRefs.value[star - 1] = el instanceof HTMLButtonElement ? el : null
}

function selectStar(star: UserRatingValue): void {
  selected.value = star
  starRefs.value[star - 1]?.focus()
}

function onStarKeydown(event: KeyboardEvent, star: UserRatingValue): void {
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    event.preventDefault()
    selectStar(Math.min(5, star + 1) as UserRatingValue)
    return
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    event.preventDefault()
    selectStar(Math.max(1, star - 1) as UserRatingValue)
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    selectStar(1)
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    selectStar(5)
  }
}

function onVisibleChange(value: boolean): void {
  emit('update:visible', value)
}

function close(): void {
  hovered.value = null
  emit('update:visible', false)
}

function confirm(): void {
  if (selected.value === null || !isUserRatingValue(selected.value)) {
    return
  }

  emit('confirm', selected.value)
}

watch(
  () => props.visible,
  (open) => {
    if (!open) {
      hovered.value = null
      return
    }

    selected.value = props.initialRating ?? null
  },
  { immediate: true },
)
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    :dismissable-mask="true"
    :pt="dialogPt"
    :close-button-props="{
      'aria-label': t('rating.closeAria'),
      class:
        'inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 outline-none transition hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200',
    }"
    @update:visible="onVisibleChange"
  >
    <template #header>
      <div class="flex min-w-0 items-start gap-3 pr-2">
        <span
          class="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400"
          aria-hidden="true"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2.7 14.7 8.4l6.3.9-4.5 4.4 1.1 6.3L12 17.1 6.4 20l1.1-6.3L3 9.3l6.3-.9L12 2.7Z"
            />
          </svg>
        </span>
        <div class="min-w-0">
          <p class="text-base font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {{ t('rating.modalTitle') }}
          </p>
          <p class="mt-0.5 text-sm leading-5 text-slate-500 dark:text-slate-400">
            {{ t('rating.modalInstruction') }}
          </p>
        </div>
      </div>
    </template>

    <div @mouseleave="hovered = null">
      <div
        role="radiogroup"
        :aria-label="starsGroupAria"
        class="flex flex-nowrap items-center justify-center gap-0.5 sm:gap-1.5"
      >
        <button
          v-for="star in USER_RATING_VALUES"
          :key="star"
          :ref="(el) => setStarRef(el, star)"
          type="button"
          role="radio"
          class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl outline-none transition duration-150 hover:scale-105 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 sm:h-12 sm:w-12"
          :class="isFilled(star) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'"
          :aria-checked="selected === star"
          :aria-label="starLabel(star)"
          :tabindex="tabIndexFor(star)"
          @click="selectStar(star)"
          @mouseenter="hovered = star"
          @keydown="onStarKeydown($event, star)"
        >
          <svg class="h-8 w-8 drop-shadow-sm" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2.7 14.7 8.4l6.3.9-4.5 4.4 1.1 6.3L12 17.1 6.4 20l1.1-6.3L3 9.3l6.3-.9L12 2.7Z"
              :fill="isFilled(star) ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <p
        class="mt-3 min-h-5 text-center text-sm font-medium"
        :class="previewValue ? 'text-amber-700 dark:text-amber-300' : 'text-slate-400 dark:text-slate-500'"
        aria-live="polite"
      >
        {{ selectedLabel }}
      </p>
    </div>

    <template #footer>
      <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-3">
        <button
          type="button"
          class="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950 sm:w-auto"
          @click="close"
        >
          {{ t('rating.cancel') }}
        </button>

        <button
          type="button"
          class="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white outline-none transition hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-violet-400 disabled:hover:bg-violet-400 dark:focus-visible:ring-offset-slate-950 sm:w-auto"
          :disabled="!canConfirm"
          @click="confirm"
        >
          {{ t('rating.confirm') }}
        </button>
      </div>
    </template>
  </Dialog>
</template>
