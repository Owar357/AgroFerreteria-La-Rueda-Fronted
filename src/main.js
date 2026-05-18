  import { createApp } from 'vue'
  import { createPinia } from 'pinia'
  import router from './router'
  import App from './App.vue'


  import ToastService from 'primevue/toastservice';
  import PrimeVueComponents from './plugins/primevue-components';


  import 'primeicons/primeicons.css'
  import 'primeflex/primeflex.css'
  import '@/assets/styles.scss'
  import '@/assets/tailwind.css'


  import PrimeVue from 'primevue/config'
  import Lara from '@primeuix/themes/lara'
  import ConfirmationService from 'primevue/confirmationservice';
  


  const app = createApp(App)


  app.use(createPinia())
  app.use(router)
  app.use(PrimeVue, {
    theme: {
      preset: Lara,
      options: {
        darkModeSelector: 'dark'
      }
    }
  })



  app.use(ToastService);
  app.use(ConfirmationService);
  app.use(PrimeVueComponents);

  app.mount('#app')   