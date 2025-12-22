import { Request, Response } from "express";
import { z } from "zod";
import { CreateCardUseCase } from "../../application/cards/usecases/CreateCardUseCase";
import { GetCardsUseCase } from "../../application/cards/usecases/GetCardsUseCase";
import { AuthService } from "../../infrastructure/auth/AuthService";
import { toCardResponse } from "../../application/cards/mappers/CardApiMapper";
import { GetQuizDayUseCase } from "../../application/quiz/usecases/GetQuizDayUseCase";
import {AnswerCardUseCase} from "../../application/cards/usecases/AnswerCardUseCase";
import {CardNotFoundError} from "../../application/cards/errors/CardNotFoundError";


const createCardSchema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
    tag: z.string().min(1).optional(),
});

const answerCardParamsSchema = z.object({
    cardId: z.uuid(),
});
const answerCardBodySchema = z.object({
    isValid: z.boolean(),
});

export class CardController {
    private auth = new AuthService();

    constructor(
        private createCard: CreateCardUseCase,
        private getCards: GetCardsUseCase,
        private getQuizDay: GetQuizDayUseCase,
        private answerCard: AnswerCardUseCase
    ) { }

    getAll = async (_req: Request, res: Response) => {
        if (!this.auth.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const cards = await this.getCards.execute();
        return res.status(200).json(cards.map(toCardResponse));
    };

    create = async (req: Request, res: Response) => {
        if (!this.auth.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const parsed = createCardSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Bad request" });
        }

        const card = await this.createCard.execute({
            question: parsed.data.question,
            answer: parsed.data.answer,
            ...(parsed.data.tag ? { tag: parsed.data.tag } : {}),
        });

        return res.status(201).json(toCardResponse(card));
    };

    getQuizz = async (req: Request, res: Response) => {
        if (!this.auth.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const date =
            typeof req.query.date === "string"
                ? req.query.date
                : undefined;

        const cards = await this.getQuizDay.execute(date);
        return res.status(200).json(cards.map(toCardResponse));
    };


    answer = async (req: Request, res: Response) => {
        if (!this.auth.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const paramsParsed = answerCardParamsSchema.safeParse(req.params);
        const bodyParsed = answerCardBodySchema.safeParse(req.body);

        if (!paramsParsed.success || !bodyParsed.success) {
            return res.status(400).json({ message: "Bad request" });
        }

        try {
            await this.answerCard.execute(paramsParsed.data.cardId, bodyParsed.data.isValid);
            return res.sendStatus(204);
        } catch (err) {
            if (err instanceof CardNotFoundError) {
                return res.status(404).json({ message: "Card not found" });
            }

            console.error("Failed to answer card", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    };


}