import { Router } from "express";
import { CardController } from "../controllers/CardController";

export function buildRoutes(cardController: CardController) {
  const routes = Router();

  //API health checkup
  routes.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  //Cards
  routes.get("/cards", cardController.getAll);
  routes.post("/cards", cardController.create);

  //Learning
  routes.get("/cards/quizz", cardController.getQuizz);

  return routes;
}
