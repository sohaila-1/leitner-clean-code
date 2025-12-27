import "reflect-metadata";
import express from "express";
import cors from "cors";
import { env } from "./infrastructure/config/env";
import { AppDataSource } from "./infrastructure/db/data-source";
import { TypeOrmCardRepository } from "./infrastructure/db/repositories/TypeOrmCardRepository";
import { TypeOrmQuizDayRepository } from "./infrastructure/db/repositories/TypeOrmQuizDayRepository";
import { CreateCardUseCase } from "./application/cards/usecases/CreateCardUseCase";
import { GetCardsUseCase } from "./application/cards/usecases/GetCardsUseCase";
import { GetQuizDayUseCase } from "./application/quiz/usecases/GetQuizDayUseCase";
import { AnswerCardUseCase } from "./application/cards/usecases/AnswerCardUseCase";
import { CardController } from "./main/controllers/CardController";
import { buildRoutes } from "./main/routes";

async function bootstrap() {
  await AppDataSource.initialize();

  const app = express();
  app.use(cors()); // IMPORTANT
  app.use(express.json());

  const cardRepository = new TypeOrmCardRepository();
  const quizDayRepository = new TypeOrmQuizDayRepository();

  const cardController = new CardController(
    new CreateCardUseCase(cardRepository),
    new GetCardsUseCase(cardRepository),
    new GetQuizDayUseCase(cardRepository, quizDayRepository),
    new AnswerCardUseCase(cardRepository)
  );

  app.use("/", buildRoutes(cardController));

  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

bootstrap();
