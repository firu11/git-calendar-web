import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router.ts';
import '@/assets/styles.css';
import '@/composables/useSettings.ts'; // init settings
import { useTranslation } from '@/composables/useTranslation';

const { i18n } = useTranslation();

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
