export class ExpectedAnswer {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Answer cannot be empty");
    }
  }
}