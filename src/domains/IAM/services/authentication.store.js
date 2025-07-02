import { defineStore } from "pinia";
import { AuthenticationService } from "./authentication.service.js";

export const useAuthenticationStore = defineStore("authentication", {
    state: () => ({
        id: null,
        username: null,
        token: null,
        isSignedIn: false,
        roles: ["ROLE_USER"]
    }),
    getters: {
        isInitialized: (state) => !!state.token,
    },
    actions: {
        initialize() {
            const token = localStorage.getItem("token");
            const username = localStorage.getItem("username");
            const userId = localStorage.getItem("userId");
            if (token && username && userId) {
                this.token = token;
                this.username = username;
                this.id = parseInt(userId);
                this.isSignedIn = true;
                console.log('🔄 Authentication store inicializado desde localStorage:', {
                    id: this.id,
                    username: this.username,
                    isSignedIn: this.isSignedIn
                });
            } else {
                console.log('⚠️ No se pudo inicializar el store - datos faltantes:', {
                    hasToken: !!token,
                    hasUsername: !!username,
                    hasUserId: !!userId
                });
            }
        },
        async signUp(signUpRequest, router, toast) {
            const service = new AuthenticationService();
            // Asegura que el rol se envíe siempre como ROLE_USER
            const requestWithRole = {
                ...signUpRequest,
                roles: ["ROLE_USER"]
            };
            const response = await service.signUp(requestWithRole);
            if (response && response.data) {
                this.id = response.data.id;
                this.username = response.data.username;
                this.roles = response.data.roles;
                toast.add({ severity: "success", summary: "Registro exitoso", life: 2000 });
                router.push({ name: "sign-in" });
            }
        },
        async signIn(signInRequest, router, toast) {
            const service = new AuthenticationService();
            const response = await service.signIn(signInRequest);
            if (response && response.data) {
                this.id = response.data.id;
                this.username = response.data.username;
                this.token = response.data.token;
                this.isSignedIn = true;
                localStorage.setItem("token", this.token);
                localStorage.setItem("username", this.username);
                localStorage.setItem("userId", this.id.toString());
                console.log('✅ Usuario autenticado y datos guardados en localStorage:', {
                    id: this.id,
                    username: this.username
                });
                toast.add({ severity: "success", summary: "Inicio de sesión exitoso", life: 2000 });
                router.push({ name: "Home" });
            }
        },
        signOut(router) {
            this.id = null;
            this.username = null;
            this.token = null;
            this.isSignedIn = false;
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("userId");
            console.log('🚪 Usuario desautenticado y datos eliminados de localStorage');
            router.push({ name: "sign-in" });
        }
    }
});