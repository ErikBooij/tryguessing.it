export default (element: Element | null): void => {
  if (element instanceof HTMLElement) {
    element.style.display = 'none';
  }
};
