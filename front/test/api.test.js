import { describe, it, expect, vi, beforeEach } from "vitest";


const { ApiService } = require("../js/api.js");

function makeLocalStorageMock() {
    const store = new Map();

    return {
        getItem: vi.fn((key) => (store.has(key) ? store.get(key) : null)),
        setItem: vi.fn((key, value) => store.set(key, String(value))),
        removeItem: vi.fn((key) => store.delete(key)),
        clear: vi.fn(() => store.clear()),
    };
}

describe("ApiService", () => {
    beforeEach(() => {
        globalThis.localStorage = makeLocalStorageMock();
        globalThis.fetch = vi.fn();
    });

    it("getQuizDay() appelle GET/cards/quizz", async () => {
        globalThis.fetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => [],
        });
        const api = new ApiService();
        await api.getQuizDay();
        expect(globalThis.fetch).toHaveBeenCalledTimes(1);
        const [url, options] = globalThis.fetch.mock.calls[0];


        expect(url).toBe("http://localhost:8080/cards/quizz");
        expect(options.method).toBe("GET");
    })

    it("answerCard() appelle PATCH /cards/:id/answer avec { isValid }", async () => {
        globalThis.fetch.mockResolvedValue({
            ok: true,
            status: 204,
            json: async () => ({}),
        })

        const api = new ApiService();
        await api.answerCard("123", true);

        const [url, options] = globalThis.fetch.mock.calls[0];
        expect(url).toBe("http://localhost:8080/cards/123/answer");
        expect(options.method).toBe("PATCH");
        expect(options.body).toBe(JSON.stringify({ isValid: true }));
    });

    it("request retourne null quand le status est 204", async () => {
        globalThis.fetch.mockResolvedValue({
            ok: true,
            status: 204,
            json: vi.fn(),
        })


        const api = new ApiService();
        const res = await api.request("/cards", { method: "GET" });

        expect(res).toBeNull();
    })


    it("getCards appelle GET/cards", async () => {
        globalThis.fetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => [],
        })

        const api = new ApiService();
        await api.getCards();

        const [url, options] = globalThis.fetch.mock.calls[0];
        expect(url).toBe("http://localhost:8080/cards")
        expect(options.method).toBe("GET")
    })

    it("createCard() appelle POST /cards (sans tag)", async () => {
        globalThis.fetch.mockResolvedValue({
            ok: true,
            status: 201,
            json: async () => ({ id: "x" })
        })

        const api = new ApiService();
        await api.createCard("q1", "rep1")

        const [url, options] = globalThis.fetch.mock.calls[0];
        expect(url).toBe("http://localhost:8080/cards");
        expect(options.method).toBe("POST");
        expect(options.body).toBe(JSON.stringify({ question: "q1", answer: "rep1" }))
    })

    it("createCard appelle POST/cards avec tag", async () => {
        globalThis.fetch.mockResolvedValue({
            ok: true,
            status: 201,
            json: async () => ({ id: "x" }),
        })

        const api = new ApiService();
        await api.createCard("question", "rep", "géo");



        const [url, options] = globalThis.fetch.mock.calls[0];

        expect(url).toBe("http://localhost:8080/cards");
        expect(options.method).toBe("POST");
        expect(options.body).toBe(JSON.stringify({ question: "question", answer: "rep", tag: "géo" }));
    });


})
