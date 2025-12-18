import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 8080),
  db: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? "postgres",
    password: process.env.DB_PASSWORD ?? "",
    name: process.env.DB_NAME ?? "leitner_db",
  },
};