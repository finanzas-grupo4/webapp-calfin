import Cookies from 'js-cookie'; // Asegúrate de importar js-cookie al inicio del archivo

export function authenticationGuard(to, from, next) {
    const isSignedIn = !!Cookies.get('token'); // Verifica si hay un token

    // Public routes - allow access
    if (!to.meta.requiresAuth) {
        if (isSignedIn && (to.name === 'sign-in' || to.name === 'sign-up')) {
            return next({ name: 'dashboard' });
        }
        return next();
    }

    // Protected routes - check authentication
    if (!isSignedIn) {
        return next({ name: 'sign-in' });
    }

    // Role-based access control
    if (to.meta.requiredRoles) {
        const rolesStr = Cookies.get('roles');
        const userRoles = rolesStr ? JSON.parse(rolesStr) : [];
        const hasRequiredRole = to.meta.requiredRoles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
            return next({ name: 'dashboard' });
        }
    }

    return next();
}