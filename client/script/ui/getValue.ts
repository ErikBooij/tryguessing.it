export default <T>(selector: string, parser: (input: string) => T): T => {
  const element: HTMLInputElement | null = document.querySelector(selector);

  if (element && element.type === 'checkbox') {
    return parser(element.checked ? 'true' : 'false');
  }

  return parser(element?.value || '');
};
