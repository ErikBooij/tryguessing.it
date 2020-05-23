// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array

export default <T>(input: T[]): T[] => {
  let counter = input.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    const temp = input[counter];
    input[counter] = input[index];
    input[index] = temp;
  }

  return input;
}
