<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import ProductForm from '@/components/products/ProductForm.vue'
import { isAppError, toAppError } from '@/config/api'
import { useActionErrorMessage } from '@/composables/useErrorPresentation'
import { useProductsCatalog } from '@/composables/useProductsCatalog'
import { productService } from '@/services/productService'
import type { Category } from '@/types/category'
import type { ProductCreatePayload } from '@/types/product'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const { messageFor } = useActionErrorMessage()
const { addCreatedProduct } = useProductsCatalog({ autoLoad: false })

const categories = ref<Category[]>([])
const categoriesLoading = ref(false)
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

async function loadCategories(): Promise<void> {
  categoriesLoading.value = true

  try {
    categories.value = await productService.getCategories()
  } catch (caught: unknown) {
    categories.value = []
    const appError = isAppError(caught) ? caught : toAppError(caught)
    toast.add({
      severity: 'error',
      summary: t('toast.error'),
      detail: messageFor(appError, 'categories'),
      life: 4000,
    })
  } finally {
    categoriesLoading.value = false
  }
}

async function handleSubmit(payload: ProductCreatePayload): Promise<void> {
  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true
  submitError.value = null

  try {
    const created = await productService.createProduct(payload)
    addCreatedProduct(created)

    toast.add({
      severity: 'success',
      summary: t('toast.success'),
      detail: t('toast.createSuccess'),
      life: 3000,
    })

    await router.push({ name: 'produtos' })
  } catch (caught: unknown) {
    // Erros já normalizados via interceptor; formulário preserva os dados.
    const appError = isAppError(caught) ? caught : toAppError(caught)
    submitError.value = messageFor(appError, 'formSave')
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel(): void {
  void router.push({ name: 'produtos' })
}

onMounted(() => {
  void loadCategories()
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-2.5 py-3 sm:px-6 sm:py-6 lg:py-8">
    <nav class="mb-3 text-sm text-slate-400 dark:text-slate-500" :aria-label="t('favorites.breadcrumb')">
      <ol class="flex flex-wrap items-center gap-1.5">
        <li>
          <RouterLink
            to="/produtos"
            class="rounded-sm outline-none hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:text-slate-300"
          >
            {{ t('favorites.home') }}
          </RouterLink>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <RouterLink
            to="/produtos"
            class="rounded-sm outline-none hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:text-slate-300"
          >
            {{ t('nav.products') }}
          </RouterLink>
        </li>
        <li aria-hidden="true">/</li>
        <li class="text-slate-500 dark:text-slate-400" aria-current="page">{{ t('form.createTitle') }}</li>
      </ol>
    </nav>

    <header class="mb-3 min-w-0 space-y-1 sm:mb-6">
      <h1 class="break-words text-xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
        {{ t('form.createTitle') }}
      </h1>
      <p class="text-sm text-slate-500 sm:text-base dark:text-slate-400">
        {{ t('form.createSubtitle') }}
      </p>
    </header>

    <ProductForm
      :categories="categories"
      :categories-loading="categoriesLoading"
      :submitting="isSubmitting"
      :submit-error="submitError"
      @submit="handleSubmit"
      @cancel="handleCancel"
      @retry-categories="loadCategories"
    />
  </div>
</template>
