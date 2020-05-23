import { City } from '../domain/City';
import { CITY, COUNTRY, Granularity } from '../constants/granularity';

export type OptionFormatter = (option: City) => string;

const country: OptionFormatter = (option: City): string => `${option.country}`;
const city: OptionFormatter = (option: City): string => `${option.name}, ${option.country}`;

export default (granularity: Granularity): OptionFormatter => {
  return ({
    [COUNTRY]: country,
    [CITY]: city
  })[granularity];
}
