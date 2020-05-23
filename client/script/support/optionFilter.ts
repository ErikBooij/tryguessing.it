import { City, compare } from '../domain/City';
import { CITY, COUNTRY, Granularity } from '../constants/granularity';

export type OptionFilter = (chosen: City[], option: City) => boolean;

const country: OptionFilter = (chosen: City[], option: City): boolean => !chosen.some(c => c.country === option.country);
const city: OptionFilter = (chosen: City[], option: City): boolean => !chosen.some(c => compare(c, option));

export default (granularity: Granularity): OptionFilter => {
  return ({
    [COUNTRY]: country,
    [CITY]: city
  })[granularity];
}
