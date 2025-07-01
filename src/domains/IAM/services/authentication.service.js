import http from "@/shared/services/http-common.js";

export class AuthenticationService {
    signIn(signInRequest) {
        return http.post(`/authentication/sign-in`, {
            username: signInRequest.username,
            password: signInRequest.password,
        });
    }
    signUp(signUpRequest) {
        return http.post(`/authentication/sign-up`, {
            username: signUpRequest.username,
            password: signUpRequest.password,
            roles: signUpRequest.roles
        });
    }

    getUserRoles(userId) {
        return http.get(`/users/${userId}`);
    }
    getUserById(userId) {
        return http.get(`/users/${userId}`);
    }

}