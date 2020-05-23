const setOptionalContent = (element: Element|string|null, content: string, parent?: Element): void => {
  if (element instanceof Element) {
    element.innerHTML = content;

    return;
  }

  if (typeof element === 'string') {
    setOptionalContent((parent || document).querySelector(element), content);
  }
};

export default setOptionalContent;
