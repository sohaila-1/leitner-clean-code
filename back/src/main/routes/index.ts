import { Router } from "express";
import { CardController } from "../controllers/CardController";

export function buildRoutes(cardController: CardController) {
  const routes = Router();

  // Health check
  routes.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Cards
  routes.get("/cards", cardController.getAll);
  routes.post("/cards", cardController.create);

  // Quiz (IMPORTANT pour review.html)
  routes.get("/quiz", cardController.getQuizz);

  // Answer card (IMPORTANT pour Correct / Incorrect)
  routes.post("/cards/:cardId/answer", cardController.answer);

  return routes;
}
