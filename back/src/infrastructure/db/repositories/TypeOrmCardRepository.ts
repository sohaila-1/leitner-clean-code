import { Repository, In } from "typeorm";
import { AppDataSource } from "../data-source";
import { CardEntity } from "../entities/CardEntity";

import { Card } from "../../../domain/cards/Card";
import { CardRepository } from "../../../domain/cards/ports/CardRepository";
import { CardDbMapper } from "../mappers/CardDbMapper";

export class TypeOrmCardRepository implements CardRepository {
  private repo: Repository<CardEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(CardEntity);
  }

  async findAll(): Promise<Card[]> {
    const entities = await this.repo.find();
    return entities.map(CardDbMapper.toDomain);
  }

  async findById(id: string): Promise<Card | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? CardDbMapper.toDomain(entity) : null;
  }

  async findManyByIds(ids: string[]): Promise<Card[]> {
    if (ids.length === 0) return [];

    const entities = await this.repo.findBy({ id: In(ids) });
    return entities.map(CardDbMapper.toDomain);
  }

  async save(card: Card): Promise<Card> {
    const existing = await this.repo.findOne({ where: { id: card.id } });

    const entity = CardDbMapper.toEntity(card, existing ?? undefined);
    await this.repo.save(entity);

    return card;
  }
}
