export class SignUpRequest {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.roles = ["ROLE_USER"];
    }
}