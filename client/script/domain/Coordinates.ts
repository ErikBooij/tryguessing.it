export type Latitude = number;
export type Longitude = number;

export type Coordinates = {
  lat: Latitude
  lng: Longitude
}

export const coordinatesCompare = (a: Coordinates, b: Coordinates): boolean => a.lat === b.lat && a.lng === b.lng;
