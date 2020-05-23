import { GameStatistics } from './statistics';
import randomString from './randomString';

export type ExportedStatistics = GameStatistics & {
  identifier: string
  recordedAt: string
}

const isGameStatistics = (input: any): input is ExportedStatistics => {
  if (typeof input !== 'object') return false;
  if (input.answered === undefined) return false;
  if (input.averageTime === undefined) return false;
  if (input.correct === undefined) return false;
  if (input.correctPercentage === undefined) return false;
  if (input.identifier === undefined) return false;
  if (input.recordedAt === undefined) return false;

  return true;
};

export class ResultsStorage {
  private localStorage: Storage;

  constructor(localstorage: Storage) {
    this.localStorage = localstorage;
  }

  public add(statistics: GameStatistics): this {
    const games = this.getAll();

    games.push({
      ...statistics,
      identifier: randomString(10),
      recordedAt: new Date().toISOString()
    });

    this.localStorage.setItem('games', JSON.stringify(games));

    return this;
  }

  public remove(identifierToRemove: string) {
    const games = this.getAll();

    this.localStorage.setItem('games', JSON.stringify(games.filter(({ identifier }) => identifier !== identifierToRemove)));
  }

  public getAll(): ExportedStatistics[] {
    const games = this.localStorage.getItem('games');

    if (games === null) {
      this.localStorage.setItem('games', JSON.stringify([]));

      return [];
    }

    try {
      const parsedGames = JSON.parse(games);

      if (!Array.isArray(parsedGames)) {
        throw new Error('Stored games do not deserialize to array');
      }


      return parsedGames
        .filter(isGameStatistics);
    } catch (e) {
      console.log(`Games found in localStorage appear invalid. Backing them up for you, but clearing the main results storage (${e.message}).`);

      localStorage.setItem(`games-invalid-${+new Date()}`, games);
      localStorage.setItem('games', JSON.stringify([]));

      return [];
    }
  }
}
