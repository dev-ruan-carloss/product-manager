<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import TimesIcon from '@primevue/icons/times'

import type { Category } from '@/types/category'
import type { ProductCreatePayload } from '@/types/product'
import { EMPTY_PRODUCT_FORM, type ProductFormData } from '@/types/productForm'
import { formatPrice } from '@/utils/formatPrice'
import { getLocalizedCategory } from '@/utils/localizeCategory'
import { productFormSchema } from '@/utils/productFormSchema'

const props = withDefaults(
  defineProps<{
    categories: Category[]
    categoriesLoading?: boolean
    submitting?: boolean
    initialValues?: ProductFormData
    submitLabel?: string
  }>(),
  {
    categoriesLoading: false,
    submitting: false,
    initialValues: undefined,
    submitLabel: undefined,
  },
)

const emit = defineEmits<{
  submit: [payload: ProductCreatePayload]
  cancel: []
  retryCategories: []
}>()

const { t, locale } = useI18n()

const FIELD_FOCUS_ORDER = ['title', 'category', 'price', 'image', 'description'] as const

const FIELD_INPUT_IDS: Record<(typeof FIELD_FOCUS_ORDER)[number], string> = {
  title: 'product-title',
  category: 'product-category',
  price: 'product-price',
  image: 'product-image',
  description: 'product-description',
}

const { defineField, errors, handleSubmit, values } = useForm({
  validationSchema: toTypedSchema(productFormSchema),
  initialValues: {
    ...EMPTY_PRODUCT_FORM,
    ...props.initialValues,
  },
})

const [title, titleAttrs] = defineField('title')
const [price, priceAttrs] = defineField('price')
const [description, descriptionAttrs] = defineField('description')
const [category, categoryAttrs] = defineField('category')
const [image, imageAttrs] = defineField('image')

const previewImageFailed = ref(false)

const resolvedSubmitLabel = computed(() => props.submitLabel ?? t('form.save'))

const categoryOptions = computed(() => {
  void locale.value

  return props.categories.map((item) => ({
    label: getLocalizedCategory(item),
    value: item,
  }))
})

const categoriesUnavailable = computed(
  () => props.categories.length === 0 && !props.categoriesLoading,
)

const previewTitle = computed(() => {
  const value = values.title?.trim()
  return value && value.length > 0 ? value : t('form.previewTitleFallback')
})

const previewCategory = computed(() => {
  void locale.value
  const value = values.category
  if (typeof value === 'string' && value.length > 0) {
    return getLocalizedCategory(value)
  }

  return t('form.categoryFallback')
})

const previewPrice = computed(() => {
  const value = values.price
  if (typeof value === 'number' && Number.isFinite(value)) {
    return formatPrice(value)
  }

  return formatPrice(0)
})

const previewImage = computed(() => {
  const value = values.image?.trim()
  return value && value.length > 0 ? value : null
})

watch(
  () => values.image,
  () => {
    previewImageFailed.value = false
  },
)

function onPreviewImageError(): void {
  previewImageFailed.value = true
}

function fieldMessageId(field: (typeof FIELD_FOCUS_ORDER)[number]): string {
  return `product-${field}-message`
}

function focusFirstInvalidField(
  fieldErrors: Partial<Record<(typeof FIELD_FOCUS_ORDER)[number], string | undefined>>,
): void {
  void nextTick(() => {
    for (const field of FIELD_FOCUS_ORDER) {
      if (!fieldErrors[field]) {
        continue
      }

      const element = document.getElementById(FIELD_INPUT_IDS[field])
      if (element instanceof HTMLElement) {
        element.focus()
        return
      }
    }
  })
}

const onSubmit = handleSubmit(
  (formValues) => {
    if (props.submitting) {
      return
    }

    const payload: ProductCreatePayload = {
      title: String(formValues.title).trim(),
      price: Number(formValues.price),
      description: String(formValues.description).trim(),
      category: String(formValues.category),
      image: String(formValues.image).trim(),
    }

    emit('submit', payload)
  },
  ({ errors: submitErrors }) => {
    focusFirstInvalidField(submitErrors)
  },
)

function onCancel(): void {
  if (props.submitting) {
    return
  }

  emit('cancel')
}
</script>

<template>
  <form class="min-w-0 space-y-4 sm:space-y-6" novalidate @submit="onSubmit">
    <div class="grid min-w-0 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
      <section
        class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-950"
        aria-labelledby="product-form-heading"
      >
        <h2 id="product-form-heading" class="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {{ t('form.heading') }}
        </h2>

        <div class="mt-4 grid min-w-0 gap-4 sm:mt-5 sm:gap-5 md:grid-cols-2">
          <div class="min-w-0 space-y-1.5 md:col-span-1">
            <label for="product-title" class="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {{ t('form.title') }}
              <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
              <span class="sr-only">{{ t('form.required') }}</span>
            </label>
            <InputText
              id="product-title"
              v-model="title"
              v-bind="titleAttrs"
              type="text"
              class="w-full"
              :placeholder="t('form.titlePlaceholder')"
              :invalid="Boolean(errors.title)"
              :disabled="submitting"
              :aria-required="true"
              :aria-invalid="errors.title ? true : undefined"
              :aria-describedby="fieldMessageId('title')"
              autocomplete="off"
            />
            <p
              :id="fieldMessageId('title')"
              :class="
                errors.title
                  ? 'text-sm text-red-600 dark:text-red-400'
                  : 'text-xs text-slate-500 dark:text-slate-400'
              "
              :role="errors.title ? 'alert' : undefined"
            >
              {{ errors.title || t('form.titleHint') }}
            </p>
          </div>

          <div class="min-w-0 space-y-1.5 md:col-span-1">
            <label for="product-category" class="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {{ t('form.category') }}
              <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
              <span class="sr-only">{{ t('form.required') }}</span>
            </label>
            <Select
              v-model="category"
              v-bind="categoryAttrs"
              input-id="product-category"
              :options="categoryOptions"
              option-label="label"
              option-value="value"
              :placeholder="t('form.categoryPlaceholder')"
              class="w-full"
              :loading="categoriesLoading"
              :invalid="Boolean(errors.category)"
              :disabled="submitting || categoriesLoading"
              :aria-required="true"
              :aria-invalid="errors.category ? true : undefined"
              :aria-describedby="fieldMessageId('category')"
            />
            <p
              :id="fieldMessageId('category')"
              :class="
                errors.category
                  ? 'text-sm text-red-600 dark:text-red-400'
                  : categoriesUnavailable
                    ? 'text-sm text-amber-700 dark:text-amber-300'
                    : 'text-xs text-slate-500 dark:text-slate-400'
              "
              :role="errors.category ? 'alert' : undefined"
            >
              <template v-if="errors.category">{{ errors.category }}</template>
              <template v-else-if="categoriesUnavailable">
                {{ t('form.categoriesLoadError') }}
                <button
                  type="button"
                  class="font-medium underline outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  @click="emit('retryCategories')"
                >
                  {{ t('error.retry') }}
                </button>
              </template>
              <template v-else>{{ t('form.categoryHint') }}</template>
            </p>
          </div>

          <div class="min-w-0 space-y-1.5 md:col-span-1">
            <label for="product-price" class="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {{ t('form.price') }}
              <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
              <span class="sr-only">{{ t('form.required') }}</span>
            </label>
            <InputNumber
              v-model="price"
              v-bind="priceAttrs"
              input-id="product-price"
              class="w-full"
              input-class="w-full"
              mode="decimal"
              :min-fraction-digits="2"
              :max-fraction-digits="2"
              :min="0"
              placeholder="0,00"
              :invalid="Boolean(errors.price)"
              :disabled="submitting"
              :aria-required="true"
              :aria-invalid="errors.price ? true : undefined"
              :aria-describedby="fieldMessageId('price')"
            />
            <p
              :id="fieldMessageId('price')"
              :class="
                errors.price
                  ? 'text-sm text-red-600 dark:text-red-400'
                  : 'text-xs text-slate-500 dark:text-slate-400'
              "
              :role="errors.price ? 'alert' : undefined"
            >
              {{ errors.price || t('form.priceHint') }}
            </p>
          </div>

          <div class="min-w-0 space-y-1.5 md:col-span-1">
            <label for="product-image" class="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {{ t('form.image') }}
              <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
              <span class="sr-only">{{ t('form.required') }}</span>
            </label>
            <InputText
              id="product-image"
              v-model="image"
              v-bind="imageAttrs"
              type="url"
              class="w-full"
              :placeholder="t('form.imagePlaceholder')"
              :invalid="Boolean(errors.image)"
              :disabled="submitting"
              :aria-required="true"
              :aria-invalid="errors.image ? true : undefined"
              :aria-describedby="fieldMessageId('image')"
              autocomplete="off"
            />
            <p
              :id="fieldMessageId('image')"
              :class="
                errors.image
                  ? 'text-sm text-red-600 dark:text-red-400'
                  : 'text-xs text-slate-500 dark:text-slate-400'
              "
              :role="errors.image ? 'alert' : undefined"
            >
              {{ errors.image || t('form.imageHint') }}
            </p>
          </div>

          <div class="min-w-0 space-y-1.5 md:col-span-2">
            <label for="product-description" class="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {{ t('form.description') }}
              <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
              <span class="sr-only">{{ t('form.required') }}</span>
            </label>
            <Textarea
              id="product-description"
              v-model="description"
              v-bind="descriptionAttrs"
              class="w-full"
              rows="6"
              auto-resize
              :placeholder="t('form.descriptionPlaceholder')"
              :invalid="Boolean(errors.description)"
              :disabled="submitting"
              :aria-required="true"
              :aria-invalid="errors.description ? true : undefined"
              :aria-describedby="fieldMessageId('description')"
            />
            <p
              :id="fieldMessageId('description')"
              :class="
                errors.description
                  ? 'text-sm text-red-600 dark:text-red-400'
                  : 'text-xs text-slate-500 dark:text-slate-400'
              "
              :role="errors.description ? 'alert' : undefined"
            >
              {{ errors.description || t('form.descriptionHint') }}
            </p>
          </div>
        </div>
      </section>

      <aside class="min-w-0 space-y-3 sm:space-y-4 xl:sticky xl:top-6 xl:self-start">
        <section
          class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-950"
          aria-labelledby="product-preview-heading"
        >
          <h2 id="product-preview-heading" class="text-base font-semibold text-slate-900 dark:text-slate-100">
            {{ t('form.preview') }}
          </h2>

          <div class="mt-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <div
              class="flex h-40 items-center justify-center border-b border-dashed border-slate-200 bg-slate-50 px-4 dark:border-slate-700 dark:bg-slate-800"
            >
              <img
                v-if="previewImage && !previewImageFailed"
                :src="previewImage"
                :alt="t('form.previewImageAlt', { title: previewTitle })"
                class="max-h-36 max-w-full object-contain"
                @error="onPreviewImageError"
              />
              <p v-else class="px-2 text-center text-xs text-slate-400 dark:text-slate-500">
                {{ t('form.previewImageHint') }}
              </p>
            </div>

            <div class="space-y-2 p-4">
              <p class="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ previewTitle }}</p>
              <p class="text-xs text-violet-700 dark:text-violet-300">{{ previewCategory }}</p>
              <p class="text-base font-bold text-violet-700 dark:text-violet-300">{{ previewPrice }}</p>
            </div>
          </div>
        </section>

        <section
          class="min-w-0 rounded-xl border border-violet-100 bg-violet-50/60 p-3 sm:p-5 dark:border-violet-900/60 dark:bg-violet-950/30"
          aria-labelledby="product-tips-heading"
        >
          <div class="flex items-center gap-2">
            <span
              class="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white"
              aria-hidden="true"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.5 18h5M10 21h4M8 10a4 4 0 1 1 8 0c0 1.5-.8 2.4-1.6 3.2-.7.7-1.4 1.4-1.4 2.8h-2c0-1.8.8-2.7 1.6-3.5.6-.6 1.4-1.3 1.4-2.5a2 2 0 1 0-4 0"
                />
              </svg>
            </span>
            <h2 id="product-tips-heading" class="text-base font-semibold text-slate-900 dark:text-slate-100">
              {{ t('form.tips') }}
            </h2>
          </div>
          <ul class="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li class="flex gap-2">
              <span class="mt-0.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true">✓</span>
              {{ t('form.tipTitle') }}
            </li>
            <li class="flex gap-2">
              <span class="mt-0.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true">✓</span>
              {{ t('form.tipImage') }}
            </li>
            <li class="flex gap-2">
              <span class="mt-0.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true">✓</span>
              {{ t('form.tipDescription') }}
            </li>
            <li class="flex gap-2">
              <span class="mt-0.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true">✓</span>
              {{ t('form.tipReview') }}
            </li>
          </ul>
        </section>
      </aside>
    </div>

    <div
      class="flex flex-col-reverse gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:p-5 dark:border-slate-700 dark:bg-slate-950"
    >
      <Button
        type="button"
        :label="t('form.cancel')"
        severity="secondary"
        outlined
        class="min-h-11 w-full sm:w-auto"
        :disabled="submitting"
        @click="onCancel"
      >
        <template #icon="slotProps">
          <TimesIcon v-bind="slotProps" />
        </template>
      </Button>

      <Button
        type="submit"
        :label="resolvedSubmitLabel"
        severity="primary"
        class="min-h-11 w-full !border-violet-600 !bg-violet-600 hover:!bg-violet-700 sm:w-auto"
        :loading="submitting"
        :disabled="submitting"
        :aria-busy="submitting"
      />
    </div>
  </form>
</template>
