<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Skeleton from 'primevue/skeleton'

import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import ProductForm from '@/components/products/ProductForm.vue'
import { useProductDetails } from '@/composables/useProductDetails'
import { productService } from '@/services/productService'
import type { Category } from '@/types/category'
import type { ProductCreatePayload, ProductUpdatePayload } from '@/types/product'
import { toProductFormData, type ProductFormData } from '@/types/productForm'
import { parseProductId } from '@/utils/parseProductId'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const productId = computed(() => parseProductId(route.params.id))

const { product, isLoading, hasError, notFound, loadProduct } = useProductDetails(productId)

const categories = ref<Category[]>([])
const categoriesLoading = ref(false)
const isSubmitting = ref(false)

const formInitialValues = computed<ProductFormData | undefined>(() => {
  if (product.value === null) {
    return undefined
  }

  return toProductFormData(product.value)
})

async function loadCategories(): Promise<void> {
  categoriesLoading.value = true

  try {
    categories.value = await productService.getCategories()
  } catch {
    categories.value = []
    toast.add({
      severity: 'error',
      summary: t('toast.error'),
      detail: t('toast.categoriesLoadError'),
      life: 4000,
    })
  } finally {
    categoriesLoading.value = false
  }
}

async function handleSubmit(formPayload: ProductCreatePayload): Promise<void> {
  if (isSubmitting.value || productId.value === null) {
    return
  }

  isSubmitting.value = true

  const payload: ProductUpdatePayload = {
    title: formPayload.title,
    price: formPayload.price,
    description: formPayload.description,
    category: formPayload.category,
    image: formPayload.image,
  }

  try {
    await productService.updateProduct(productId.value, payload)

    toast.add({
      severity: 'success',
      summary: t('toast.success'),
      detail: t('toast.updateSuccess'),
      life: 3000,
    })

    await router.push({ name: 'produtos' })
  } catch {
    // Erros da API já chegam como AppError via interceptor em config/api.ts.
    toast.add({
      severity: 'error',
      summary: t('toast.error'),
      detail: t('toast.updateError'),
      life: 4000,
    })
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel(): void {
  void router.push({ name: 'produtos' })
}

function goToCatalog(): void {
  void router.push({ name: 'produtos' })
}

watch(productId, () => {
  isSubmitting.value = false
})

onMounted(() => {
  void loadCategories()
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-2.5 py-3 sm:px-6 sm:py-6 lg:py-8">
    <nav class="mb-3 text-sm text-slate-400 dark:text-slate-500" :aria-label="t('favorites.breadcrumb')">
      <ol class="flex min-w-0 flex-wrap items-center gap-1.5">
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
        <li v-if="product" class="min-w-0 max-w-full break-words text-slate-500 dark:text-slate-400">
          <RouterLink
            :to="{ name: 'produto-detalhes', params: { id: product.id } }"
            class="rounded-sm outline-none hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:text-slate-300"
          >
            {{ product.title }}
          </RouterLink>
        </li>
        <li v-else class="text-slate-500 dark:text-slate-400">{{ t('product.product') }}</li>
        <li aria-hidden="true">/</li>
        <li class="text-slate-500 dark:text-slate-400" aria-current="page">{{ t('product.editTitle') }}</li>
      </ol>
    </nav>

    <header class="mb-3 min-w-0 space-y-1 sm:mb-6">
      <h1 class="break-words text-xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
        {{ t('form.editTitle') }}
      </h1>
      <p class="text-sm text-slate-500 sm:text-base dark:text-slate-400">
        {{ t('form.editSubtitle') }}
      </p>
    </header>

    <div
      v-if="isLoading"
      role="status"
      aria-live="polite"
      aria-busy="true"
      class="space-y-6"
    >
      <p class="sr-only">{{ t('product.loadingEdit') }}</p>
      <div class="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-950">
          <Skeleton width="12rem" height="1.5rem" class="mb-5" />
          <div class="grid gap-5 md:grid-cols-2">
            <Skeleton width="100%" height="2.75rem" />
            <Skeleton width="100%" height="2.75rem" />
            <Skeleton width="100%" height="2.75rem" />
            <Skeleton width="100%" height="2.75rem" />
            <Skeleton width="100%" height="8rem" class="md:col-span-2" />
          </div>
        </div>
        <div class="min-w-0 space-y-4">
          <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-950">
            <Skeleton width="8rem" height="1.25rem" class="mb-4" />
            <Skeleton width="100%" height="10rem" class="mb-4" />
            <Skeleton width="90%" height="1rem" class="mb-2" />
            <Skeleton width="40%" height="1rem" />
          </div>
        </div>
      </div>
    </div>

    <ErrorState
      v-else-if="hasError"
      :title="t('product.errorTitle')"
      :description="t('product.errorDescription')"
      @retry="loadProduct"
    />

    <EmptyState
      v-else-if="notFound"
      :title="t('product.notFoundTitle')"
      :description="t('product.notFoundDescription')"
      :action-label="t('product.backToProducts')"
      @action="goToCatalog"
    />

    <ProductForm
      v-else-if="product && formInitialValues"
      :key="product.id"
      :categories="categories"
      :categories-loading="categoriesLoading"
      :submitting="isSubmitting"
      :initial-values="formInitialValues"
      :submit-label="t('form.saveChanges')"
      @submit="handleSubmit"
      @cancel="handleCancel"
      @retry-categories="loadCategories"
    />
  </div>
</template>
