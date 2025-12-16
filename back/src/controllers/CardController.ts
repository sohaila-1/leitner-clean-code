import { Request, Response } from "express";
import { z } from "zod";
import { CardRepository } from "../repositories/CardRepository";
import { toCardDto } from "../mappers/card.mapper";

const createCardSchema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
    tag: z.string().min(1).optional(),
});

export class CardController {
    constructor(
        private cards = new CardRepository()
    ) { }

    getAll = async (_req: Request, res: Response) => {
        const cards = await this.cards.findAll();
        res.status(200).json(cards.map(toCardDto));
    };

    create = async (req: Request, res: Response) => {
        const parsed = createCardSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ message: "Bad request" });

        const card = await this.cards.createAndSave({
            question: parsed.data.question,
            answer: parsed.data.answer,
            tag: parsed.data.tag ?? null,
        });

        res.status(201).json(toCardDto(card));
    };
}