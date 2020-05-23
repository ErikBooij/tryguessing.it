export default (element: HTMLElement | null): () => void => {
  if (!element) {
    return () => {};
  }

  element.innerHTML = '';

  const inner = document.createElement('div');
  inner.classList.add('h-full', 'bg-blue-500', 'w-24', 'animate-slide-right-infinite');

  element.appendChild(inner);

  return () => {
    element.removeChild(inner);
  };
};
