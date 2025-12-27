/**
 * API Service - Communication avec le backend
 */

const API_BASE_URL = "http://localhost:8080";

class ApiService {
  constructor() {
    this.token = this.getStoredToken();
  }

  /**
   * Récupère le token stocké en localStorage
   */
  getStoredToken() {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem("auth_token");
  }


  /**
   * Stocke le token
   */
  setToken(token) {
    if (token) {
      localStorage.setItem("auth_token", token);
      this.token = token;
    } else {
      localStorage.removeItem("auth_token");
      this.token = null;
    }
  }

  /**
   * Effectue une requête HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Ajoute le token d'authentification si disponible
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        this.setToken(null);
        window.dispatchEvent(new CustomEvent("unauthorized"));
        throw new Error("Unauthorized - please login again");
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      // Certaines réponses n'ont pas de contenu (204 No Content)
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  /**
   * Récupère toutes les cartes
   */
  async getCards() {
    return this.request("/cards", {
      method: "GET",
    });
  }

  /**
   * Crée une nouvelle carte
   */
  async createCard(question, answer, tag = null) {
    const body = {
      question,
      answer,
    };
    if (tag) {
      body.tag = tag;
    }

    return this.request("/cards", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  /**
   * Récupère le quiz du jour
   */
  async getQuizDay(date = null) {
    let endpoint = "/cards/quizz";
    if (date) {
      endpoint += `?date=${encodeURIComponent(date)}`;
    }
    return this.request(endpoint, {
      method: "GET",
    });
  }

  /**
   * Soumet une réponse pour une carte
   */
  async answerCard(cardId, isValid) {
    return this.request(`/cards/${cardId}/answer`, {
      method: "PATCH",
      body: JSON.stringify({ isValid }),
    });
  }

  /**
   * Vérification d'authentification basique
   */
  isAuthenticated() {
    return !!this.token;
  }
}

if (typeof window !== "undefined") {
  window.ApiService = ApiService;
  window.api = new ApiService()
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = { ApiService }
}
