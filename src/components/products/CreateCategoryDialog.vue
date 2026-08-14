<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'

import { PRODUCT_CATEGORY_MAX_LENGTH } from '@/schemas/productFormLimits'
import type { Category } from '@/types/category'
import { validateNewCategory } from '@/utils/customCategory'

const props = defineProps<{
  visible: boolean
  existingCategories: readonly Category[]
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: [category: Category]
}>()

const { t } = useI18n()
const name = ref('')
const errorReason = ref<'empty' | 'tooLong' | 'duplicate' | null>(null)

const nameLength = computed(() => name.value.length)

const errorMessage = computed(() => {
  if (errorReason.value === 'empty') {
    return t('validation.categoryRequired')
  }

  if (errorReason.value === 'tooLong') {
    return t('validation.categoryMax', { max: PRODUCT_CATEGORY_MAX_LENGTH })
  }

  if (errorReason.value === 'duplicate') {
    return t('validation.categoryDuplicate')
  }

  return ''
})

const dialogPt = {
  root: {
    class:
      'w-[min(100%,26rem)] max-[450px]:w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-950',
  },
  header: {
    class: 'mb-0 items-start border-b border-slate-100 px-5 py-4 dark:border-slate-800',
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
    class: 'border-t border-slate-100 px-5 !pt-3 pb-4 dark:border-slate-800',
  },
}

function onVisibleChange(value: boolean): void {
  emit('update:visible', value)
}

function close(): void {
  emit('update:visible', false)
}

function focusNameInput(): void {
  void nextTick(() => {
    const element = document.getElementById('new-category-name')
    if (element instanceof HTMLElement) {
      element.focus()
    }
  })
}

function confirm(): void {
  const result = validateNewCategory(name.value, props.existingCategories)

  if (!result.ok) {
    errorReason.value = result.reason
    return
  }

  errorReason.value = null
  emit('confirm', result.category)
}

watch(
  () => props.visible,
  (open) => {
    if (!open) {
      return
    }

    name.value = ''
    errorReason.value = null
    focusNameInput()
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
      'aria-label': t('form.createCategoryCloseAria'),
      class:
        'inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 outline-none transition hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200',
    }"
    @update:visible="onVisibleChange"
  >
    <template #header>
      <div class="min-w-0 pr-2">
        <p class="text-base font-semibold leading-6 text-slate-900 dark:text-slate-100">
          {{ t('form.createCategoryTitle') }}
        </p>
        <p class="mt-0.5 text-sm leading-5 text-slate-500 dark:text-slate-400">
          {{ t('form.createCategoryInstruction') }}
        </p>
      </div>
    </template>

    <div class="min-w-0 space-y-1.5">
      <label for="new-category-name" class="block text-sm font-medium text-slate-700 dark:text-slate-200">
        {{ t('form.categoryName') }}
        <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
        <span class="sr-only">{{ t('form.required') }}</span>
      </label>
      <InputText
        id="new-category-name"
        v-model="name"
        type="text"
        class="w-full"
        :placeholder="t('form.categoryNamePlaceholder')"
        :maxlength="PRODUCT_CATEGORY_MAX_LENGTH"
        :invalid="Boolean(errorReason)"
        :aria-required="true"
        :aria-invalid="errorReason ? true : undefined"
        :aria-describedby="'new-category-name-message new-category-name-counter'"
        autocomplete="off"
        @keyup.enter="confirm"
      />
      <div class="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <p
          id="new-category-name-message"
          :class="
            errorReason
              ? 'text-sm text-red-600 dark:text-red-400'
              : 'text-xs text-slate-500 dark:text-slate-400'
          "
          :role="errorReason ? 'alert' : undefined"
        >
          {{ errorMessage || t('form.categoryNameHint') }}
        </p>
        <p id="new-category-name-counter" class="shrink-0 text-xs tabular-nums text-slate-500 dark:text-slate-400">
          <span aria-hidden="true">{{ nameLength }}/{{ PRODUCT_CATEGORY_MAX_LENGTH }}</span>
          <span class="sr-only">{{
            t('form.characterCountAria', {
              current: nameLength,
              max: PRODUCT_CATEGORY_MAX_LENGTH,
            })
          }}</span>
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-3">
        <button
          type="button"
          class="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950 sm:w-auto"
          @click="close"
        >
          {{ t('form.cancel') }}
        </button>

        <button
          type="button"
          class="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white outline-none transition hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 sm:w-auto"
          @click="confirm"
        >
          {{ t('form.confirm') }}
        </button>
      </div>
    </template>
  </Dialog>
</template>
