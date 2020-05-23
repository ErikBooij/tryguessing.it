import { City } from '../domain/City';

export type Answer = {
  correct: City
  given: City|null
  duration: number
}

type FinishedHandler = (answers: Answer[]) => void;
type ResetHandler = () => void;

type UpdateHandler = (answers: Answer[]) => void;
type RegisteredUpdateHandler = {
  handler: UpdateHandler
  onFinished: boolean
}

export class GameManager {
  private answers: Answer[] = [];
  private numberOfQuestions: number = Infinity;

  private finishedHandlers: FinishedHandler[] = [];
  private resetHandlers: ResetHandler[] = [];
  private updateHandlers: RegisteredUpdateHandler[] = [];

  end(): void {
    this.finishedHandlers.forEach(handler => handler(this.answers));
  }

  start(numberOfQuestions: number) {
    this.numberOfQuestions = numberOfQuestions;

    this.answers = [];
  }

  registerAnswer(correct: City, given: City|null, duration: number): void {
    this.answers.push({ correct, given, duration });

    const isFinished = this.answers.length >= this.numberOfQuestions;

    this.updateHandlers.forEach(({ handler, onFinished }) => {
      if (isFinished && !onFinished) {
        return;
      }

      handler(this.answers)
    });

    if (isFinished) {
      setTimeout(() => this.end(), 1);
    }
  }

  registerFinishedHandler(handler: FinishedHandler): this {
    this.finishedHandlers.push(handler);

    return this;
  }

  registerResetHandler(handler: ResetHandler): this {
    this.resetHandlers.push(handler);

    return this;
  }

  registerUpdateHandler(handler: UpdateHandler, onFinished: boolean = true): this {
    this.updateHandlers.push({ handler, onFinished });

    return this;
  }
}
