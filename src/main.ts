import { createApp } from 'vue';
import App from './App.vue';
import router from './router.ts';
import { CalendarCore } from './wasm/core-wrapper.ts';

await CalendarCore.setCorsProxy('http://localhost:8000');

const app = createApp(App);
app.use(router);
app.mount('#app');
