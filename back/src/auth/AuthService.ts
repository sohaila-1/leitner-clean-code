import { Auth } from "./Auth";

export class AuthService implements Auth {
  isAuthenticated(): boolean {
    return true;
  }
}