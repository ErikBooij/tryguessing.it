import * as difficulty from './difficulty';
import * as granularity from './granularity';
import * as timeLimit from './timeLimit';

type GameSettings = {
  difficulty: difficulty.Difficulty
  granularity: granularity.Granularity
  questionCount: number,
  timeLimit: timeLimit.TimeLimit
}

export default GameSettings;
