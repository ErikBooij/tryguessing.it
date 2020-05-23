export default (templateSelector: string): Node|null => {
  const template = document.querySelector(templateSelector);

  if (!(template instanceof HTMLTemplateElement)) {
    return null;
  }

  return template.content.firstElementChild?.cloneNode(true) || null;
}
