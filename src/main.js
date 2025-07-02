import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createPinia } from 'pinia'
import { faHome, faSearch, faHeart, faUser, faBars, faChartBar, faDollarSign, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
library.add(faHome, faSearch, faHeart, faUser, faBars, faChartBar, faDollarSign, faSignOutAlt)
import Checkbox from 'primevue/checkbox';
import { useAuthenticationStore } from './domains/IAM/services/authentication.store.js';



import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Menu from 'primevue/menu'
import Sidebar from 'primevue/sidebar'
import Toast from 'primevue/toast'
import Card from 'primevue/card'
import Calendar from 'primevue/calendar'

const app = createApp(App)

const pinia = createPinia();
app.use(pinia);

// Inicializar autenticación desde localStorage
const authStore = useAuthenticationStore();
authStore.initialize();



app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(PrimeVue)
app.use(ToastService)



app.component('Button', Button)
app.component('Dropdown', Dropdown)
app.component('InputText', InputText)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Dialog', Dialog)
app.component('Menu', Menu)
app.component('Sidebar', Sidebar)
app.component('Toast', Toast)
app.component('Checkbox', Checkbox);
app.component('Card', Card)
app.component('Calendar', Calendar)

app.mount('#app')