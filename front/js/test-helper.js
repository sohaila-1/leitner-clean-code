/**
 * Test Helper - Utilitaire pour tester l'intégration
 * 
 * À utiliser dans la console du navigateur (F12) pour tester :
 * 
 * // Simuler un login :
 * auth.login("demo-token-123");
 * 
 * // Recharger les cartes :
 * loadCards();
 * 
 * // Tester une réponse :
 * await submitAnswer(true);
 * 
 * // Voir l'état de l'auth :
 * console.log(api.isAuthenticated());
 */

// Ajouter cette fonction au contexte global pour faciliter les tests
window.testApi = {
  // Simule un login pour le développement
  mockLogin() {
    console.log("🔐 Simulating login...");
    auth.login("dev-token-" + Math.random().toString(36).substr(2, 9));
    loadCards();
    console.log("✅ Logged in. Cards reloading...");
  },

  // Teste la connexion au backend
  async testConnection() {
    console.log("🧪 Testing backend connection...");
    try {
      const response = await fetch("http://localhost:8080/health");
      if (response.ok) {
        console.log("✅ Backend is running!");
        return await response.json();
      } else {
        console.log("❌ Backend returned:", response.status);
      }
    } catch (error) {
      console.log("❌ Cannot connect to backend:", error.message);
    }
  },

  // Affiche l'état actuel
  getStatus() {
    return {
      authenticated: api.isAuthenticated(),
      token: api.getStoredToken(),
      cardsLoaded: flashcards.length,
      cards: flashcards
    };
  },

  // Déconnexion
  logout() {
    auth.logout();
    loadCards();
    console.log("✅ Logged out");
  }
};

console.log(
  "%c🚀 Leitner Frontend Ready!",
  "color: #4CAF50; font-size: 14px; font-weight: bold;"
);
console.log(
  "%cTest commands available: testApi.mockLogin(), testApi.testConnection(), testApi.getStatus()",
  "color: #2196F3; font-size: 12px;"
);
