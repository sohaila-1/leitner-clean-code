import { QuizDay } from "../QuizDay";

export interface QuizDayRepository {
  findByDate(date: string): Promise<QuizDay | null>;
  save(quizDay: QuizDay): Promise<QuizDay>;
}
