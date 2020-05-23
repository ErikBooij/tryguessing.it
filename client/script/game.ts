import exclusiveViewFactory from './ui/exclusiveView';
import fetchSettings from './ui/fetchSettings';
import loadingIndicator from './ui/loadingIndicator';

import { COLOR_CORRECT, COLOR_WRONG } from './constants/mapIcon';

import { DataProvider } from './support/DataProvider';
import { Answer, GameManager } from './support/GameManager';
import { ResultsStorage } from './support/ResultsStorage';
import { SettingsStorage } from './support/SettingsStorage';
import distance, { DistanceUnit } from './support/distance';
import calculateStatistics from './support/statistics';
import optionFilterFactory from './support/optionFilter';
import optionFormatterFactory from './support/optionFormatter';

import { City, compare } from './domain/City';

import hideElement from './ui/hideElement';
import renderResults from './ui/renderResults';
import setOptionsFactory from './ui/setOptions';
import setOptionalContent from './ui/setOptionalContent';
import showElement from './ui/showElement';

import { createMap } from './map';
import * as selector from './selectors';
import { getTimeLimitMilliseconds, UNLIMITED } from './constants/timeLimit';

declare global {
  interface Window {
    iAmACheater: () => void
  }
}

(function (document, window) {
  const dataProvider = new DataProvider();
  const gameManager = new GameManager();
  const resultsStorage = new ResultsStorage(window.localStorage);
  const settingsStorage = new SettingsStorage(window.localStorage);

  const exclusiveView = exclusiveViewFactory(
    selector.VIEW_GAME,
    selector.VIEW_GAME_SETTINGS,
    selector.VIEW_LOADING,
    selector.VIEW_MAP,
    selector.VIEW_RESULTS
  );

  const rightWrong = exclusiveViewFactory(
    selector.ANSWER_RIGHT,
    selector.ANSWER_LATE,
    selector.ANSWER_WRONG
  );

  rightWrong(selector.ANSWER_RIGHT);

  const mapContainer = document.querySelector(selector.MAP);
  const map = mapContainer instanceof HTMLElement ? createMap(mapContainer, { lat: 53, lng: 6 }) : null;

  const startGame = async () => {
    const settings = fetchSettings();
    const {
      difficulty,
      granularity,
      questionCount,
      timeLimit,
    } = settings;

    settingsStorage.set(settings);

    exclusiveView(selector.VIEW_LOADING);

    let cheatMode = false;

    window.iAmACheater = () => {
      console.log('Alright you cheater, the correct answers will be presented here.');

      if (answers[0]) {
        console.log(`The answer to the current question is ${optionFormatter(answers[0])}`);
      }

      cheatMode = true;
    };

    const stopLoading = loadingIndicator(document.querySelector(selector.LOADING_INDICATOR));
    const loadingScreenMinDuration = new Promise(resolve => setTimeout(resolve, 1500));

    const answers: City[] = [];
    let questionTimer : number|null = null;

    const optionFormatter = optionFormatterFactory(granularity);
    const setOptions = setOptionsFactory(optionFormatter);
    const optionFilter = optionFilterFactory(granularity);

    const timeLimitMilliseconds = getTimeLimitMilliseconds(timeLimit);

    const displayState = (answers: Answer[]): void => {
      const {
        answered,
        averageTime,
        correct,
        correctPercentage
      } = calculateStatistics(answers);

      setOptionalContent(selector.STATE_NUM_QUESTION, `${answered} / ${questionCount === Infinity ? '&infin;' : questionCount}`);
      setOptionalContent(selector.STATE_NUM_CORRECT, `${correct}`);
      setOptionalContent(selector.STATE_PERC_CORRECT, `(${correctPercentage}%)`);
      setOptionalContent(selector.STATE_TIME, `${averageTime.toFixed(2)}s`);
    };

    let startTime: number;

    const prepareQuestion = (): void => {
      exclusiveView(selector.VIEW_GAME);

      const subject = dataProvider.getCity(granularity, difficulty, optionFilter);
      const miss1 = dataProvider.getCity(granularity, difficulty, optionFilter, subject);
      const miss2 = dataProvider.getCity(granularity, difficulty, optionFilter, subject, miss1);

      let latElement: Element|null, lngElement: Element|null;

      if ((latElement = document.querySelector(selector.QUESTION_LAT)) instanceof HTMLElement) {
        latElement.innerHTML = subject.location.lat.toFixed(5);
      }
      if ((lngElement = document.querySelector(selector.QUESTION_LNG)) instanceof HTMLElement) {
        lngElement.innerHTML = subject.location.lng.toFixed(5);
      }

      const [ option1, option2, option3 ] = setOptions(subject, miss1, miss2);

      answers[0] = subject;
      answers[1] = option1;
      answers[2] = option2;
      answers[3] = option3;

      startTime = new Date().getTime();

      if (timeLimit !== UNLIMITED) {
        questionTimer = setTimeout(() => registerAnswer(null)(), timeLimitMilliseconds);
      }

      if (cheatMode) {
        console.log(`The correct answer is ${optionFormatter(subject)}`);
      }
    };

    const showAnswerOnMap = (correct: City, answer: City|null, completionFunction: () => void) => {
      exclusiveView(selector.VIEW_MAP);

      map?.init();
      map?.removeMarkers();
      map?.addMarker(correct.location, COLOR_CORRECT);
      rightWrong(selector.ANSWER_RIGHT);

      const wrongAnswerElement = document.querySelector(selector.ANSWER_WRONG_ELEMENT);

      const continueButton = document.querySelector(selector.MAP_CONTINUE);

      if (continueButton instanceof HTMLElement) {
        const newButton = continueButton.cloneNode(true);
        newButton.addEventListener('click', completionFunction);

        continueButton.parentNode?.replaceChild(newButton, continueButton);
      }

      hideElement(document.querySelector(selector.ANSWER_WRONG_DETAILS));

      if (!answer) {
        showElement(wrongAnswerElement);
        rightWrong(selector.ANSWER_LATE);

        setOptionalContent(selector.ANSWER_WRONG_CORRECTION, optionFormatter(correct));
        map?.setPosition(correct.location);
      } else if (!compare(correct, answer)) {
        showElement(wrongAnswerElement);
        showElement(document.querySelector(selector.ANSWER_WRONG_DETAILS));

        rightWrong(selector.ANSWER_WRONG);

        map?.addMarker(answer.location, COLOR_WRONG);
        map?.fit(correct.location, answer.location);

        const distanceKm = distance(correct.location, answer.location, DistanceUnit.KILOMETERS);
        const distanceMi = distance(correct.location, answer.location, DistanceUnit.MILES);

        let emoji = '';

        switch (true) {
          case distanceKm > 5000:
            emoji = '🤦‍♂️';
            break;
          case distanceKm > 2500:
            emoji = '🤨';
            break;
          case distanceKm > 1000:
            emoji = '👌';
            break;
          default:
            emoji = '👏';
        }

        setOptionalContent(selector.ANSWER_WRONG_CORRECTION, `${optionFormatter(correct)}`);
        setOptionalContent(selector.ANSWER_WRONG_GIVEN, `${optionFormatter(answer)}`);
        setOptionalContent(selector.ANSWER_WRONG_DISTANCE_KM, `${distanceKm.toFixed(1)}km`);
        setOptionalContent(selector.ANSWER_WRONG_DISTANCE_MI, `${distanceMi.toFixed(1)}mi`);
        setOptionalContent(selector.ANSWER_WRONG_DISTANCE_EMOJI, emoji);
      } else {
        hideElement(wrongAnswerElement);
        map?.setPosition(correct.location);
      }
    };

    const registerAnswer = (index: number | null) => (): void => {
      questionTimer && clearTimeout(questionTimer);

      const correctAnswer = answers[0];
      const givenAnswer = index === null ? null : answers[index];

      const duration = new Date().getTime() - startTime;

      showAnswerOnMap(correctAnswer, givenAnswer, () => {
        gameManager.registerAnswer(correctAnswer, givenAnswer, duration);
      });
    };

    document.querySelector(selector.ACTION_ANSWER_1)?.addEventListener('click', registerAnswer(1));
    document.querySelector(selector.ACTION_ANSWER_2)?.addEventListener('click', registerAnswer(2));
    document.querySelector(selector.ACTION_ANSWER_3)?.addEventListener('click', registerAnswer(3));

    dataProvider.onReady(async (): Promise<void> => {
      console.log(`Starting a game of ${questionCount === Infinity ? 'infinite' : questionCount} questions at '${difficulty}' difficulty, with a granularity of '${granularity}' and a '${timeLimit}' time limit`);

      displayState([]);

      await loadingScreenMinDuration;

      stopLoading();

      exclusiveView(selector.VIEW_GAME);

      prepareQuestion();

      gameManager.start(questionCount);

      gameManager.registerUpdateHandler((answers: Answer[]) => {
        prepareQuestion();

        exclusiveView(selector.VIEW_GAME);

        displayState(answers);
      });

      gameManager.registerFinishedHandler((answers: Answer[]): void => {
        exclusiveView(selector.VIEW_RESULTS);

        const statistics = calculateStatistics(answers);

        resultsStorage.add(statistics);

        renderResults(resultsStorage.getAll(), identifier => resultsStorage.remove(identifier));
      });
    });
  };

  const initializeGame = () => {
    document.querySelector(selector.ACTION_START_GAME)?.addEventListener('click', startGame);

    const storedSettings = settingsStorage.get();

    if (storedSettings === null) {
      return;
    }

    document.querySelector(`${selector.SETTING_GRANULARITY} [value=${storedSettings.granularity}]`)?.setAttribute('selected', 'true');
    document.querySelector(`${selector.SETTING_DIFFICULTY} [value=${storedSettings.difficulty}]`)?.setAttribute('selected', 'true');
    document.querySelector(`${selector.SETTING_TIME_LIMIT} [value=${storedSettings.timeLimit}]`)?.setAttribute('selected', 'true');
    if (storedSettings.questionCount === Infinity) {
      document.querySelector(`${selector.SETTING_UNLIMITED_QUESTIONS}`)?.setAttribute('checked', `true`);
    } else {
      document.querySelector(`${selector.SETTING_QUESTION_COUNT}`)?.setAttribute('value', `${storedSettings.questionCount}`);
    }
  };

  initializeGame();
})(document, window);
