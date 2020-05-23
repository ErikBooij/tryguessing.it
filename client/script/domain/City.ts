import { Coordinates, coordinatesCompare } from './Coordinates';

export type City = {
  name: string
  country: string
  location: Coordinates
}

export const compare = (a: City|null, b: City|null): boolean => {
  return a !== null &&
         b !== null &&
         coordinatesCompare(a.location, b.location) && a.name === b.name && a.country === b.country;
};
