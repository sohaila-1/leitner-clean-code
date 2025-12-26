import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import { CardNotFoundError } from "../../src/application/cards/errors/CardNotFoundError";
import express from "express";
import {buildRoutes} from "../../src/main/routes";
import {CardController} from "../../src/main/controllers/CardController";


function makeTestApp(options?: {
    answerCardExecute?: (cardId: string, isValid: boolean) => Promise<void>;
}) {
    const app = express();
    app.use(express.json());

    const createCardUseCase = {
        execute: vi.fn()
    } as any;
    const getCardsUseCase = { execute: vi.fn() } as any;
    const getQuizDayUseCase = { execute: vi.fn() } as any;

    const answerCardUseCase = {
        execute: options?.answerCardExecute ? vi.fn(options.answerCardExecute) : vi.fn().mockResolvedValue(undefined),
    } as any;

    const controller = new CardController(
        createCardUseCase,
        getCardsUseCase,
        getQuizDayUseCase,
        answerCardUseCase
    )

    app.use(buildRoutes(controller));
    return { app, answerCardUseCase };
}


describe("PATCH /cards/:cardId/answer", () => {
    it("doit retourner 204 si la reponse est valide", async () => {
        const { app } = makeTestApp();

        await request(app)
            .patch("/cards/6c10ad48-2bb8-4e2e-900a-21d62c00c07b/answer")
            .send({ isValid: true })
            .expect(204);
    })

    it("doit retourner 400 si l'id de la carte n'est pas un UUID", async () => {
        const { app } = makeTestApp();

        await request(app)
            .patch("/cards/not-a-uuid/answer")
            .send({ isValid: true })
            .expect(400);
    })

    it("doit retourner 400 si le body de la requête est invalide", async () => {
        const { app } = makeTestApp();

        await request(app)
            .patch("/cards/6c10ad48-2bb8-4e2e-900a-21d62c00c07b/answer")
            .send({}) // missing isValid
            .expect(400);
    })

    it("doit retourner 404 si la carte n'existe pas", async () => {
        const { app } = makeTestApp({
            answerCardExecute: async (cardId: string) => {
                throw new CardNotFoundError(cardId);
            }
        })

        await request(app).patch("/cards/6c10ad48-2bb8-4e2e-900a-21d62c00c07b/answer")
            .send({ isValid: true })
            .expect(404);
    });
});
