import { Category } from "../entities/CardEntity";

export interface CardDto {
  id: string;
  question: string;
  answer: string;
  category: Category;
  tag?: string;
}