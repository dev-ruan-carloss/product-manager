<script setup lang="ts">
import { onErrorCaptured, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import ErrorState from '@/components/ErrorState.vue'
import { logUnexpectedError } from '@/utils/logError'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const hasError = ref(false)
const viewKey = ref(0)

onErrorCaptured((error) => {
  logUnexpectedError(error, {
    source: 'ErrorBoundary',
    route: route.fullPath,
  })
  hasError.value = true
  return false
})

watch(
  () => route.fullPath,
  () => {
    hasError.value = false
  },
)

function retry(): void {
  hasError.value = false
  viewKey.value += 1
}

function goHome(): void {
  hasError.value = false
  void router.push({ name: 'produtos' })
}
</script>

<template>
  <ErrorState
    v-if="hasError"
    :title="t('errors.pageTitle')"
    :description="t('errors.pageDescription')"
    :action-label="t('errors.retry')"
    :secondary-action-label="t('errors.backHome')"
    @retry="retry"
    @secondary="goHome"
  />
  <div v-else :key="viewKey">
    <slot />
  </div>
</template>
