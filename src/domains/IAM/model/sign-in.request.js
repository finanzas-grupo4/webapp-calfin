export class SignInRequest {
  constructor(username, password, recaptchaToken = "") {
    this.username = username;
    this.password = password;
  }
}