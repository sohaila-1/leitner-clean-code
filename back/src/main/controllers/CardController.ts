import { Request, Response } from "express";
import { z } from "zod";
import { CreateCardUseCase } from "../../application/cards/usecases/CreateCardUseCase";
import { GetCardsUseCase } from "../../application/cards/usecases/GetCardsUseCase";
import { AuthService } from "../../infrastructure/auth/AuthService";
import { toCardResponse } from "../../application/cards/mappers/CardApiMapper";
import { GetQuizDayUseCase } from "../../application/quiz/usecases/GetQuizDayUseCase";


const createCardSchema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
    tag: z.string().min(1).optional(),
});

export class CardController {
    private auth = new AuthService();

    constructor(
        private createCard: CreateCardUseCase,
        private getCards: GetCardsUseCase,
        private getQuizDay: GetQuizDayUseCase
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
}