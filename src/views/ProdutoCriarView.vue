<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import ProductForm from '@/components/products/ProductForm.vue'
import { productService } from '@/services/productService'
import type { Category } from '@/types/category'
import type { ProductCreatePayload } from '@/types/product'

const router = useRouter()
const toast = useToast()

const categories = ref<Category[]>([])
const categoriesLoading = ref(false)
const isSubmitting = ref(false)

async function loadCategories(): Promise<void> {
  categoriesLoading.value = true

  try {
    categories.value = await productService.getCategories()
  } catch {
    categories.value = []
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível carregar as categorias.',
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

  try {
    await productService.createProduct(payload)

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Produto criado com sucesso.',
      life: 3000,
    })

    await router.push({ name: 'produtos' })
  } catch {
    // Erros da API já chegam como AppError via interceptor em config/api.ts.
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível criar o produto.',
      life: 4000,
    })
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
    <nav class="mb-3 text-sm text-slate-400 dark:text-slate-500" aria-label="Trilha de navegação">
      <ol class="flex flex-wrap items-center gap-1.5">
        <li>
          <RouterLink
            to="/produtos"
            class="rounded-sm outline-none hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:text-slate-300"
          >
            Início
          </RouterLink>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <RouterLink
            to="/produtos"
            class="rounded-sm outline-none hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:text-slate-300"
          >
            Produtos
          </RouterLink>
        </li>
        <li aria-hidden="true">/</li>
        <li class="text-slate-500 dark:text-slate-400" aria-current="page">Novo Produto</li>
      </ol>
    </nav>

    <header class="mb-3 min-w-0 space-y-1 sm:mb-6">
      <h1 class="break-words text-xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">Novo Produto</h1>
      <p class="text-sm text-slate-500 sm:text-base dark:text-slate-400">
        Preencha os dados abaixo para cadastrar um novo produto.
      </p>
    </header>

    <ProductForm
      :categories="categories"
      :categories-loading="categoriesLoading"
      :submitting="isSubmitting"
      @submit="handleSubmit"
      @cancel="handleCancel"
      @retry-categories="loadCategories"
    />
  </div>
</template>
