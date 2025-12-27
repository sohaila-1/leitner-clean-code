/**
 * Authentication Service - Simple authentication management
 */

class AuthService {
  constructor() {
    this.token = this.getStoredToken();
  }

  /**
   * Récupère le token stocké en localStorage
   */
  getStoredToken() {
    return localStorage.getItem("auth_token");
  }

  /**
   * Stocke un token (simulation de login)
   */
  login(token) {
    localStorage.setItem("auth_token", token);
    this.token = token;
    api.setToken(token);
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout() {
    localStorage.removeItem("auth_token");
    this.token = null;
    api.setToken(null);
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Récupère le token actuel
   */
  getToken() {
    return this.token;
  }
}

// Instance globale du service d'authentification
const auth = new AuthService();
