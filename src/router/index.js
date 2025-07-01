import { createRouter, createWebHistory } from 'vue-router';

// Importa las rutas de cada bounded context aquí
import calculatorRoutes from '../Calculator/Components/routes';
// Ejemplo para futuros bounded contexts:
// import userRoutes from '../User/routes';
// import adminRoutes from '../Admin/routes';

const routes = [
  ...calculatorRoutes,
  // ...userRoutes,
  // ...adminRoutes,
  // Agrega aquí más rutas de otros bounded contexts
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
