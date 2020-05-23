import * as city from '../domain/City';

import { Answer } from './GameManager';

export type GameStatistics = {
  answered: number
  averageTime: number
  correct: number
  correctPercentage: string
};

export default (answers: Answer[]): GameStatistics => {
  const answered = answers.length;
  const correct = answers.filter(a => city.compare(a.given, a.correct)).length;
  const correctPercentage = answered > 0 ? ((correct / answered) * 100).toFixed(2) : '0';
  const averageTime = answers.length > 0
    ? answers.map(a => a.duration).reduce((c: number, d: number): number => c + d, 0) / answers.length / 1000
    : 0;

  return {
    answered,
    averageTime,
    correct,
    correctPercentage
  };
}
