import GameSettings from '../constants/gameSettings';

export class SettingsStorage {
  private localStorage: Storage;

  constructor(localstorage: Storage) {
    this.localStorage = localstorage;
  }

  public set(settings: GameSettings): void {
    if (settings.questionCount === Infinity) {
      settings.questionCount = -1;
    }

    this.localStorage.setItem('settings', JSON.stringify(settings));
  }

  public get(): GameSettings|null {
    const item = this.localStorage.getItem('settings');

    if (item === null) {
      return null;
    }

    try {
      const settings = JSON.parse(item) as GameSettings;

      if (settings.questionCount === -1) {
        settings.questionCount = Infinity;
      }

      return settings;
    } catch (e) {
      console.error(`An error occurred while trying to deserialize settings: ${e.message}`);

      return null;
    }
  }
}
