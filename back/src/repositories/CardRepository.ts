import { In, Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { CardEntity } from "../entities/CardEntity";

export class CardRepository {
  private repo: Repository<CardEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(CardEntity);
  }

  findAll(): Promise<CardEntity[]> {
    return this.repo.find();
  }

  findById(id: string): Promise<CardEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  findManyByIds(ids: string[]): Promise<CardEntity[]> {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }

    return this.repo.findBy({
      id: In(ids),
    });
  }

  createAndSave(data: Pick<CardEntity, "question" | "answer" | "tag">): Promise<CardEntity> {
    const card = this.repo.create({
      ...data,
      category: "FIRST"
    });
    return this.repo.save(card);
  }

  save(card: CardEntity): Promise<CardEntity> {
    return this.repo.save(card);
  }
}