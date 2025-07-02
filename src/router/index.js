import { createRouter, createWebHistory } from 'vue-router';

import Calculator from "@/domains/Calculator/pages/Calculator.vue";
import Home from "@/domains/Home/pages/Home.vue";
import SignIn from '@/domains/IAM/pages/sign-in.component.vue';
import SignUp from '@/domains/IAM/pages/sign-up.component.vue';
import AllBonds from '@/domains/PublicBonds/pages/AllBonds.vue';
import { useAuthenticationStore } from '@/domains/IAM/services/authentication.store.js';



const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/calculator',
    name: 'Calculator',
    component: Calculator,
    meta: { requiresAuth: true }
  },
  {
    path: '/all-bonds',
    name: 'AllBonds',
    component: AllBonds,
    meta: { requiresAuth: false }
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    component: SignIn,
    meta: { requiresAuth: false }
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: SignUp,
    meta: { requiresAuth: false }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Protección de rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthenticationStore();

  // Verificar token en localStorage si el store no tiene isSignedIn
  if (!authStore.isSignedIn) {
    const token = localStorage.getItem('token');
    if (token) {
      authStore.isSignedIn = true;
      authStore.token = token;
      authStore.username = localStorage.getItem('username');
    }
  }

  if (to.meta.requiresAuth && !authStore.isSignedIn) {
    next('/sign-in');
  } else if ((to.path === '/sign-in' || to.path === '/sign-up') && authStore.isSignedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
