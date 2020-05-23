import { City } from '../domain/City';
import { OptionFilter } from './optionFilter';
import { CITY, Granularity } from '../constants/granularity';
import { Difficulty, EASY } from '../constants/difficulty';
import distance, { DistanceUnit } from './distance';

type RawCity = {
  c: string
  n: string
  lt: number
  lg: number
  cp: boolean
}

export class DataProvider {
  private cities: City[] = [];
  private capitals: City[] = [];
  private initialization: Promise<void> | null = null;

  async init(): Promise<void> {
    if (!(this.initialization instanceof Promise)) {
      this.initialization = fetch('data/cities.json')
        .then(async (res: Response): Promise<RawCity[]> => await res.json())
        .then(this.prepareData.bind(this))
        .then(() => console.log('Cities loaded'))
        .catch(e => console.log(e));
    }

    return this.initialization;
  }

  getCity(granularity: Granularity, difficulty: Difficulty, optionFilter: OptionFilter, ...not: City[]): City {
    const MAX_ITERATIONS = 250;
    let iterations = 0;

    const candidates = granularity === CITY ? this.cities : this.capitals;
    const sortedCandidates = difficulty === EASY || not[ 0 ] === undefined
      ? candidates
      : candidates.sort(
        (a: City, b: City) =>
          distance(a.location, not[ 0 ].location, DistanceUnit.KILOMETERS) - distance(b.location, not[ 0 ].location, DistanceUnit.KILOMETERS),
      );

    if (candidates.length <= not.length) {
      console.error('Cannot guarantee a different city, because number of exclusions is at least a high as the total number of cities');
    }

    const notCities = not.map(this.cityRepresentation);

    let city: City;

    do {
      iterations++;
      city = sortedCandidates[ difficulty === EASY ? Math.floor(Math.random() * sortedCandidates.length) : iterations + 1 % sortedCandidates.length ];
    } while ((notCities.includes(this.cityRepresentation(city)) || !optionFilter(not, city)) && iterations < MAX_ITERATIONS);

    if (iterations >= MAX_ITERATIONS) {
      console.log('Could not find an option that meets all criteria');
    }

    return city;
  }

  onReady(callback: () => void): void {
    this.init()
        .then(callback);
  }

  private cityRepresentation(city: City): string {
    return `${city.name} - ${city.country}`;
  }

  private prepareData(cities: RawCity[]) {
    this.cities = cities.map(this.mapRawCity);
    this.capitals = Array.from(cities.reduce((carry: Map<string, City>, rawCity: RawCity): Map<string, City> => {
      if (rawCity.cp) {
        carry.set(rawCity.c, this.mapRawCity(rawCity));
      }

      return carry;
    }, new Map()).values());
  }

  private mapRawCity(rawCity: RawCity): City {
    return {
      country: rawCity.c,
      location: {
        lat: rawCity.lt,
        lng: rawCity.lg,
      },
      name: rawCity.n,
    };
  }
}
