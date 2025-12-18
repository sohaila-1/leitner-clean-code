// src/infrastructure/db/repositories/TypeOrmQuizDayRepository.ts
import { Repository } from "typeorm";

import { AppDataSource } from "../data-source";
import { QuizDayEntity } from "../entities/QuizDayEntity";

import { QuizDay } from "../../../domain/quiz/QuizDay";
import { QuizDayRepository } from "../../../domain/quiz/ports/QuizDayRepository";

export class TypeOrmQuizDayRepository implements QuizDayRepository {
  private repo: Repository<QuizDayEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(QuizDayEntity);
  }

  async findByDate(date: string): Promise<QuizDay | null> {
    const entity = await this.repo.findOne({ where: { date } });
    if (!entity) return null;

    return new QuizDay(
      entity.date,
      entity.cardIds,
      entity.generatedAt
    );
  }

  async save(quizDay: QuizDay): Promise<QuizDay> {
    const entity = this.repo.create({
      date: quizDay.date,
      cardIds: quizDay.cardIds,
      generatedAt: quizDay.generatedAt,
    });

    await this.repo.save(entity);
    return quizDay;
  }
}