import {Category} from "../../src/domain/cards/Category";
import {Card} from "../../src/domain/cards/Card";
import {Question} from "../../src/domain/questions/Question";
import {ExpectedAnswer} from "../../src/domain/answers/ExpectedAnswer";
import {describe, expect, it} from "vitest";

function makeCard(category: Category) {
    return new Card ("card1",
        new Question("Capital de la France ?"),
        new ExpectedAnswer("Paris"),
        "Géo",
        category,
        null
    )
}

describe("Card.validate", () => {
    it("passe de FIRST à SECOND quand la réponse est correcte ", () => {
        const card = makeCard("FIRST");
        const  answeredAt = new  Date("2025-01-01T00:00:00Z");
        card.validate(true, answeredAt);
        expect(card.category).toBe("SECOND");
        expect(card.lastAnsweredAt).toEqual(answeredAt);
    })

    it("revient à FIRST quand la réponse est incorrecte", () => {
        const card = makeCard("THIRD");
        const  answeredAt = new  Date("2025-01-01T00:00:00Z");
        card.validate(false, answeredAt);
        expect(card.category).toBe("FIRST");
        expect(card.lastAnsweredAt).toEqual(answeredAt);

    })

    it("passe de SEVENTH à DONE quand la reponse est correcte", () => {
        const card = makeCard("SEVENTH");
        card.validate(true, new Date("2025-01-01T00:00:00Z"));
        expect(card.category).toBe("DONE");
    })

    it("reste DONE même après une réponse correcte", () => {
        const card = makeCard("DONE");
        const at = new Date("2025-01-02T00:00:00.000Z");
        card.validate(true, at);
        expect(card.category).toBe("DONE");
        expect(card.lastAnsweredAt).toEqual(at);
    })

})