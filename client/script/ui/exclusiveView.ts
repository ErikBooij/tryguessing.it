import hideElement from './hideElement';
import showElement from './showElement';

export default (...viewSelectors: string[]) => (activeView: string): void => {
  viewSelectors.forEach(s => s === activeView ? showElement(document.querySelector(s)) : hideElement(document.querySelector(s)));
};
