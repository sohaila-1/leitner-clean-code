import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { QuizDayEntity } from "../entities/QuizDayEntity";

export class QuizDayRepository {
  private repo: Repository<QuizDayEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(QuizDayEntity);
  }

  findByDate(date: string): Promise<QuizDayEntity | null> {
    return this.repo.findOne({ where: { date } });
  }

  save(quizDay: QuizDayEntity): Promise<QuizDayEntity> {
    return this.repo.save(quizDay);
  }
}