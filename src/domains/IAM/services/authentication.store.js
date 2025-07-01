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
    actions: {
        async signUp(signUpRequest, router, toast) {
            const service = new AuthenticationService();
            const response = await service.signUp(signUpRequest);
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
            router.push({ name: "sign-in" });
        }
    }
});