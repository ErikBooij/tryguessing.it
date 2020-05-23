import format from 'date-fns/format';

const yesterday = (date: Date): Date => {
  date.setDate(date.getDate() - 1);

  return date;
};

const isToday = (date: Date): boolean => date.toDateString() === new Date().toDateString();
const isYesterday = (date: Date): boolean => date.toDateString() === yesterday(new Date()).toDateString();

export default (date: Date): string => {
  let day: string;

  switch (true) {
    case isToday(date):
      day = 'Today';
      break;
    case isYesterday(date):
      day = 'Yesterday';
      break;
    default:
      day = format(date, 'MMM do');
  }



  return `${day}, ${format(date, 'p')}`;
};
