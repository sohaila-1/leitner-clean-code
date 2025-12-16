import { Router } from "express";
import { CardController } from "./controllers/CardController";

export const routes = Router();
const controller = new CardController();

//API health checkup
routes.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

//Cards
routes.get("/cards", controller.getAll);
routes.post("/cards", controller.create);