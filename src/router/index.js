import { createRouter, createWebHistory } from 'vue-router';

import Calculator from "@/Calculator/pages/Calculator.vue";
import Home from "@/Home/pages/Home.vue";

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/calculator', name: 'Calculator', component: Calculator },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
