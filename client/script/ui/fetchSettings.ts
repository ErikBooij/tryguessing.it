import GameSettings from '../constants/gameSettings';

import getValue from './getValue';

import * as selector from '../selectors';

import * as difficulty from '../constants/difficulty';
import * as granularity from '../constants/granularity';
import * as timeLimit from '../constants/timeLimit';

export default (): GameSettings => {
  return {
    difficulty: getValue(selector.SETTING_DIFFICULTY, (value: any): difficulty.Difficulty => {
      return [ difficulty.EASY, difficulty.HARD ].includes(String(value))
        ? String(value) as difficulty.Difficulty
        : difficulty.EASY;
    }),
    granularity: getValue(selector.SETTING_GRANULARITY, (value: any): granularity.Granularity => {
      return [ granularity.CITY, granularity.COUNTRY ].includes(String(value))
        ? String(value) as granularity.Granularity
        : granularity.COUNTRY;
    }),
    questionCount: getValue(selector.SETTING_UNLIMITED_QUESTIONS, (value: any): boolean => value === 'true')
      ? Infinity
      : getValue(selector.SETTING_QUESTION_COUNT, (value: any): number => Number(value)),
    timeLimit: getValue(selector.SETTING_TIME_LIMIT, (value: any): timeLimit.TimeLimit => {
      return [ timeLimit.SHORT, timeLimit.MEDIUM, timeLimit.LONG, timeLimit.UNLIMITED ].includes(String(value))
        ? String(value) as timeLimit.TimeLimit
        : timeLimit.MEDIUM;
    }),
  };
};
