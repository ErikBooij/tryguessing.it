import * as selector from '../selectors';
import { ExportedStatistics } from '../support/ResultsStorage';
import elementFromTemplate from './elementFromTemplate';
import setOptionalContent from './setOptionalContent';
import formatDate from './formatDate';

const emptyNode = (text?: string) => new Comment(text);

type DeleteFunction = (identifier: string) => void;

export default (games: ExportedStatistics[], remove: DeleteFunction): void => {
  const container = document.querySelector(selector.RESULT_LIST);

  if (!container) return;

  container.innerHTML = '';
  games
    .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt) * -1)
    .map(game => {
      const element = elementFromTemplate(selector.RESULT_TEMPLATE);

      if (!(element instanceof HTMLElement)) return emptyNode('Template could not be rendered');

      setOptionalContent(selector.RESULT_TEMPLATE_TIME, (formatDate(new Date(game.recordedAt))), element);
      setOptionalContent(selector.RESULT_TEMPLATE_CORRECT, `${game.correct} / ${game.answered} (${game.correctPercentage}%)`, element);
      setOptionalContent(selector.RESULT_TEMPLATE_AVERAGE_TIME, `${game.averageTime.toFixed(2)}s`, element);

      const deleteButton = element.querySelector(selector.RESULT_TEMPLATE_DELETE);

      if (deleteButton) {
        deleteButton.addEventListener('click', () => {
          remove(game.identifier);

          const row = deleteButton.closest('tr');

          row?.parentNode?.removeChild(row);
        });
      }

      return element;
    })
    .forEach(node => container.appendChild(node));
};
