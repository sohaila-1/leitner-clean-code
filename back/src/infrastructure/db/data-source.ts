import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "../config/env";
import { CardEntity } from "./entities/CardEntity";
import { QuizDayEntity } from "./entities/QuizDayEntity";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.name,
  synchronize: true,
  logging: false,
  entities: [CardEntity, QuizDayEntity],
});