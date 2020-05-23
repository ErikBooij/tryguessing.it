import { Coordinates } from '../domain/Coordinates';

export enum DistanceUnit {
  MILES = (1 / 1.609),
  KILOMETERS = 1
};

const deg2rad = (degrees: number): number => degrees * (Math.PI/180);

// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
export default ({ lat: lat1, lng: lng1 }: Coordinates, { lat: lat2, lng: lng2}: Coordinates, unit: DistanceUnit): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lng2 - lng1);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c * unit;
}
