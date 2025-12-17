import { Request, Response } from "express";
import { z } from "zod";
import { CardRepository } from "../repositories/CardRepository";
import { toCardDto } from "../mappers/card.mapper";
import { AuthService } from "../auth/AuthService";
import { QuizDayRepository } from "../repositories/QuizDayRepository";
import { LeitnerService } from "../services/LeitnerService";

function toISODateOnly(d: Date) {
    return d.toISOString().slice(0, 10);
}

const createCardSchema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
    tag: z.string().min(1).optional(),
});

export class CardController {
    constructor(
        private cards = new CardRepository(),
        private quizDays = new QuizDayRepository(),
        private leitner = new LeitnerService()
    ) { }
    private auth = new AuthService();

    getAll = async (_req: Request, res: Response) => {
        if (!this.auth.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const cards = await this.cards.findAll();
        res.status(200).json(cards.map(toCardDto));
    };

    create = async (req: Request, res: Response) => {
        if (!this.auth.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const parsed = createCardSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ message: "Bad request" });

        const card = await this.cards.createAndSave({
            question: parsed.data.question,
            answer: parsed.data.answer,
            tag: parsed.data.tag ?? null,
        });

        res.status(201).json(toCardDto(card));
    };

    getQuizz = async (req: Request, res: Response) => {
        const dateQuery = req.query.date;

        // Date in format YYYY-MM-DD or no date (then today as default)
        const date =
            typeof dateQuery === "string" && dateQuery.trim().length > 0
                ? dateQuery
                : toISODateOnly(new Date());

        const existing = await this.quizDays.findByDate(date);
        if (existing) {
            const cards = await this.cards.findManyByIds(existing.cardIds);
            const byId = new Map(cards.map(c => [c.id, c]));
            const ordered = existing.cardIds.map(id => byId.get(id)).filter(Boolean) as any[];
            return res.status(200).json(ordered.map(toCardDto));
        }

        const all = await this.cards.findAll();
        const selected = all.filter(c => c.category !== "DONE");
        const cardIds = selected.map(c => c.id);

        await this.quizDays.save({
            date,
            cardIds,
            generatedAt: new Date(),
        } as any);

        return res.status(200).json(selected.map(toCardDto));
    }
}