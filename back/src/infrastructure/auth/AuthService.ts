import { Auth } from "../../domain/auth/Auth";

export class AuthService implements Auth {
  isAuthenticated(): boolean {
    return true;
  }
}