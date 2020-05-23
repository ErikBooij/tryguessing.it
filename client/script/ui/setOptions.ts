import * as selectors from '../selectors';
import { City } from '../domain/City';
import shuffle from '../support/shuffle';
import setOptionalContent from './setOptionalContent';
import { OptionFormatter } from '../support/optionFormatter';

export default (optionFormatter: OptionFormatter) => (correct: City, miss1: City, miss2: City): City[] => {
  const shuffledAnswers = shuffle([correct, miss1, miss2]);

  setOptionalContent(selectors.ANSWER_TEXT_1, optionFormatter(shuffledAnswers[0]));
  setOptionalContent(selectors.ANSWER_TEXT_2, optionFormatter(shuffledAnswers[1]));
  setOptionalContent(selectors.ANSWER_TEXT_3, optionFormatter(shuffledAnswers[2]));

  return shuffledAnswers;
}
