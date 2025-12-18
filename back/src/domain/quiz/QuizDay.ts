export class QuizDay {
  constructor(
    public readonly date: string,
    public readonly cardIds: string[],
    public readonly generatedAt: Date
  ) {}

  static create(date: string, cardIds: string[], now: Date = new Date()): QuizDay {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error("Invalid quiz date format (expected YYYY-MM-DD)");
    }

    const uniqueIds: string[] = [];
    const seen = new Set<string>();
    for (const id of cardIds) {
      if (!seen.has(id)) {
        seen.add(id);
        uniqueIds.push(id);
      }
    }

    return new QuizDay(date, uniqueIds, now);
  }
}
