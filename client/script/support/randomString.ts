const CHARACTERS = '1234567890abcdefghijklmnopqrstuvwxuz';

export default (length: number): string => {
  const numChars = CHARACTERS.length;

  return Array.from({ length }).map(_ => CHARACTERS[Math.floor(Math.random() * numChars)]).join('');
};
