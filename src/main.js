import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import reactiveStorage from "vue-reactive-storage";

import PrimeVue from 'primevue/config';
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Panel from 'primevue/panel';
import Password from 'primevue/password';

import 'primevue/resources/themes/lara-light-teal/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.use(reactiveStorage, {
  "isAuth": false,
});

app.component('Menubar', Menubar);
app.component('InputText', InputText);
app.component('Button', Button);
app.component('Panel', Panel);
app.component('Password', Password);

app.mount('#app')
