export class Question {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Question cannot be empty");
    }
  }
}