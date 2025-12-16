import express from "express";
import { env } from "./config/env";
import { AppDataSource } from "./database/data-source";
import { routes } from "./routes";

async function bootstrap() {
  await AppDataSource.initialize();

  const app = express();
  app.use(express.json());

  app.use(routes);

  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});