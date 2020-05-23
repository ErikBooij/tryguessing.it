export const SHORT = 'short';
export const MEDIUM = 'medium';
export const LONG = 'long';
export const UNLIMITED = 'unlimited';

export type TimeLimit = 'short' | 'medium' | 'long' | 'unlimited';

export const getTimeLimitMilliseconds = (timeLimit: TimeLimit): number => (({
  [SHORT]: 5000,
  [MEDIUM]: 10000,
  [LONG]: 30000,
  [UNLIMITED]: -1
})[timeLimit]);
