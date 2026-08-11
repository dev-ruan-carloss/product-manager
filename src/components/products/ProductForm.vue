<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
    submitLabel: 'Salvar Produto',
  },
)

const emit = defineEmits<{
  submit: [payload: ProductCreatePayload]
  cancel: []
  retryCategories: []
}>()

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

const categoryOptions = computed(() =>
  props.categories.map((item) => ({
    label: item,
    value: item,
  })),
)

const previewTitle = computed(() => {
  const value = values.title?.trim()
  return value && value.length > 0 ? value : 'Título do produto'
})

const previewCategory = computed(() => {
  const value = values.category
  return typeof value === 'string' && value.length > 0 ? value : 'Categoria'
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

const onSubmit = handleSubmit((formValues) => {
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
})

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
          Informações do produto
        </h2>

        <div class="mt-4 grid min-w-0 gap-4 sm:mt-5 sm:gap-5 md:grid-cols-2">
          <div class="min-w-0 space-y-1.5 md:col-span-1">
            <label for="product-title" class="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Título do produto
              <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
            </label>
            <InputText
              id="product-title"
              v-model="title"
              v-bind="titleAttrs"
              type="text"
              class="w-full"
              placeholder="Ex.: Mens Casual Slim Fit T-Shirts"
              :invalid="Boolean(errors.title)"
              :disabled="submitting"
              :aria-invalid="Boolean(errors.title)"
              :aria-describedby="
                errors.title ? 'product-title-error product-title-help' : 'product-title-help'
              "
              autocomplete="off"
            />
            <p id="product-title-help" class="text-xs text-slate-500 dark:text-slate-400">
              Digite um título claro e descritivo.
            </p>
            <p
              v-if="errors.title"
              id="product-title-error"
              class="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {{ errors.title }}
            </p>
          </div>

          <div class="min-w-0 space-y-1.5 md:col-span-1">
            <label for="product-category" class="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Categoria
              <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
            </label>
            <Select
              v-model="category"
              v-bind="categoryAttrs"
              input-id="product-category"
              :options="categoryOptions"
              option-label="label"
              option-value="value"
              placeholder="Selecione uma categoria"
              class="w-full"
              :loading="categoriesLoading"
              :invalid="Boolean(errors.category)"
              :disabled="submitting || categoriesLoading"
              :aria-invalid="Boolean(errors.category)"
              :aria-describedby="
                errors.category
                  ? 'product-category-error product-category-help'
                  : 'product-category-help'
              "
            />
            <p id="product-category-help" class="text-xs text-slate-500 dark:text-slate-400">
              Escolha a categoria do produto.
            </p>
            <p
              v-if="errors.category"
              id="product-category-error"
              class="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {{ errors.category }}
            </p>
            <p
              v-else-if="categories.length === 0 && !categoriesLoading"
              class="text-sm text-amber-700 dark:text-amber-300"
            >
              Não foi possível carregar as categorias.
              <button
                type="button"
                class="font-medium underline outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                @click="emit('retryCategories')"
              >
                Tentar novamente
              </button>
            </p>
          </div>

          <div class="min-w-0 space-y-1.5 md:col-span-1">
            <label for="product-price" class="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Preço
              <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
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
              :aria-invalid="Boolean(errors.price)"
              :aria-describedby="
                errors.price ? 'product-price-error product-price-help' : 'product-price-help'
              "
            />
            <p id="product-price-help" class="text-xs text-slate-500 dark:text-slate-400">Informe o preço do produto.</p>
            <p
              v-if="errors.price"
              id="product-price-error"
              class="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {{ errors.price }}
            </p>
          </div>

          <div class="min-w-0 space-y-1.5 md:col-span-1">
            <label for="product-image" class="block text-sm font-medium text-slate-700 dark:text-slate-200">
              URL da imagem
              <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
            </label>
            <InputText
              id="product-image"
              v-model="image"
              v-bind="imageAttrs"
              type="url"
              class="w-full"
              placeholder="https://exemplo.com/imagem.jpg"
              :invalid="Boolean(errors.image)"
              :disabled="submitting"
              :aria-invalid="Boolean(errors.image)"
              :aria-describedby="
                errors.image ? 'product-image-error product-image-help' : 'product-image-help'
              "
              autocomplete="off"
            />
            <p id="product-image-help" class="text-xs text-slate-500 dark:text-slate-400">
              Cole o link da imagem do produto.
            </p>
            <p
              v-if="errors.image"
              id="product-image-error"
              class="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {{ errors.image }}
            </p>
          </div>

          <div class="min-w-0 space-y-1.5 md:col-span-2">
            <label for="product-description" class="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Descrição
              <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
            </label>
            <Textarea
              id="product-description"
              v-model="description"
              v-bind="descriptionAttrs"
              class="w-full"
              rows="6"
              auto-resize
              placeholder="Descreva o produto em detalhes..."
              :invalid="Boolean(errors.description)"
              :disabled="submitting"
              :aria-invalid="Boolean(errors.description)"
              :aria-describedby="
                errors.description
                  ? 'product-description-error product-description-help'
                  : 'product-description-help'
              "
            />
            <p id="product-description-help" class="text-xs text-slate-500 dark:text-slate-400">
              Informe uma descrição clara do produto.
            </p>
            <p
              v-if="errors.description"
              id="product-description-error"
              class="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {{ errors.description }}
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
            Prévia do produto
          </h2>

          <div class="mt-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <div
              class="flex h-40 items-center justify-center border-b border-dashed border-slate-200 bg-slate-50 px-4 dark:border-slate-700 dark:bg-slate-800"
            >
              <img
                v-if="previewImage && !previewImageFailed"
                :src="previewImage"
                :alt="`Prévia de ${previewTitle}`"
                class="max-h-36 max-w-full object-contain"
                @error="onPreviewImageError"
              />
              <p v-else class="px-2 text-center text-xs text-slate-400 dark:text-slate-500">
                Imagem do produto. Será carregada da URL informada.
              </p>
            </div>

            <div class="space-y-2 p-4">
              <p class="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ previewTitle }}</p>
              <p class="text-xs capitalize text-violet-700 dark:text-violet-300">{{ previewCategory }}</p>
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
            <h2 id="product-tips-heading" class="text-base font-semibold text-slate-900 dark:text-slate-100">Dicas</h2>
          </div>
          <ul class="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li class="flex gap-2">
              <span class="mt-0.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true">✓</span>
              Use um título objetivo e descritivo.
            </li>
            <li class="flex gap-2">
              <span class="mt-0.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true">✓</span>
              Cole uma URL de imagem válida.
            </li>
            <li class="flex gap-2">
              <span class="mt-0.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true">✓</span>
              A descrição deve ser clara e completa.
            </li>
            <li class="flex gap-2">
              <span class="mt-0.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true">✓</span>
              Revise os dados antes de salvar.
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
        label="Cancelar"
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
        :label="submitLabel"
        severity="primary"
        class="min-h-11 w-full !border-violet-600 !bg-violet-600 hover:!bg-violet-700 sm:w-auto"
        :loading="submitting"
        :disabled="submitting"
        :aria-busy="submitting"
      />
    </div>
  </form>
</template>
