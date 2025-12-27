import { Card } from "../Card";

export interface CardRepository {
  findAll(): Promise<Card[]>;
  findById(id: string): Promise<Card | null>;
  save(card: Card): Promise<Card>;
  findManyByIds(ids: string[]): Promise<Card[]>;
  findByTags(tags: string[]): Promise<Card[]>;

}