import { createPinia } from 'pinia'
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { createApp } from 'vue'

import App from './App.vue'
import { i18n } from './i18n'
import router from './router'
import { useLocaleStore } from '@/stores/localeStore'
import { logUnexpectedError } from '@/utils/logError'

import './assets/styles/main.css'

const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{violet.50}',
      100: '{violet.100}',
      200: '{violet.200}',
      300: '{violet.300}',
      400: '{violet.400}',
      500: '{violet.500}',
      600: '{violet.600}',
      700: '{violet.700}',
      800: '{violet.800}',
      900: '{violet.900}',
      950: '{violet.950}',
    },
    // Placeholder inválido permanece neutro; destaque fica na borda e na mensagem.
    colorScheme: {
      light: {
        formField: {
          invalidPlaceholderColor: '{form.field.placeholder.color}',
        },
      },
      dark: {
        formField: {
          invalidPlaceholderColor: '{form.field.placeholder.color}',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: AppPreset,
    options: {
      // Alinhado à classe `.dark` no <html>, gerenciada pela themeStore.
      darkModeSelector: '.dark',
    },
  },
})
app.use(ToastService)

app.config.errorHandler = (error, _instance, info) => {
  logUnexpectedError(error, {
    source: 'vue.errorHandler',
    operation: info,
  })
}

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    logUnexpectedError(event.reason, {
      source: 'window.unhandledrejection',
    })
  })
}

// Sincroniza idioma persistido com i18n/document no boot.
useLocaleStore()

app.mount('#app')
