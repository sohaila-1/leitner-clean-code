import { Category } from "../../../domain/cards/Category";

export interface CardResponse {
  id: string;
  question: string;
  answer: string;
  category: Category;
  tag?: string;
}