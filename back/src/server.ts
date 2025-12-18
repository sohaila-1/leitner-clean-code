import "reflect-metadata";
import express from "express";
import { env } from "./infrastructure/config/env";
import { AppDataSource } from "./infrastructure/db/data-source";
import { TypeOrmCardRepository } from "./infrastructure/db/repositories/TypeOrmCardRepository";
import { CreateCardUseCase } from "./application/cards/usecases/CreateCardUseCase";
import { GetCardsUseCase } from "./application/cards/usecases/GetCardsUseCase";
import { GetQuizDayUseCase } from "./application/quiz/usecases/GetQuizDayUseCase";
import { CardController } from "./main/controllers/CardController";
import { buildRoutes } from "./main/routes";
import { TypeOrmQuizDayRepository } from "./infrastructure/db/repositories/TypeOrmQuizDayRepository";

async function bootstrap() {
  await AppDataSource.initialize();

  const app = express();
  app.use(express.json());

  const cardRepository = new TypeOrmCardRepository();
  const quizDayRepository = new TypeOrmQuizDayRepository();

  const createCardUseCase = new CreateCardUseCase(cardRepository);
  const getCardsUseCase = new GetCardsUseCase(cardRepository);
  const getQuizDayUseCase = new GetQuizDayUseCase(
    cardRepository,
    quizDayRepository
  );

  const cardController = new CardController(
    createCardUseCase,
    getCardsUseCase,
    getQuizDayUseCase
  );

  const routes = buildRoutes(cardController);
  app.use("/", routes);

  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});