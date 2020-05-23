import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import { Vector } from 'ol/layer';
import { MultiPoint, Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { OSM, Vector as SourceVector } from 'ol/source';

import { Coordinates } from './domain/Coordinates';
import { Coordinate } from 'ol/coordinate';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import { Circle } from 'ol/style';
import { RADIUS } from './constants/mapIcon';

type MapWrapper = {
  map: Map,
  addMarker: (position: Coordinates, color: string) => void
  fit: (positionA: Coordinates, positionB: Coordinates) => void
  init: () => void
  removeMarkers: () => void
  setPosition: (position: Coordinates) => void
  zoom: (level: number) => void
}

const toMapCoordinate = (position?: Coordinates): Coordinate => fromLonLat([position?.lng || 0, position?.lat || 0]);

export const createMap = (element: HTMLElement, center?: Coordinates, zoom?: number): MapWrapper => {
  let markers: Vector[] = [];

  const map = new Map({
    target: element,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: toMapCoordinate(center),
      zoom: zoom || 5,
    }),
  });

  return {
    map,
    addMarker(position: Coordinates, color: string) {
      const icon = new Style({
        image: new Circle({
          radius: RADIUS,
          fill: new Fill({ color })
        })
      });

      const marker = new Vector({
        style: icon,
        source: new SourceVector({
          features: [
            new Feature({
              geometry: new Point(toMapCoordinate(position))
            }),
          ],
        })
      });

      markers.push(marker);
      map.addLayer(marker);
    },
    fit(positionA: Coordinates, positionB: Coordinates) {
      map.getView().fit(new MultiPoint([toMapCoordinate(positionA), toMapCoordinate(positionB)]), { padding: [ 50, 50, 50, 50 ] })
    },
    init() { map.updateSize() },
    removeMarkers() {
      markers.forEach(m => m.getSource().clear());
      markers = [];
    },
    setPosition(position: Coordinates) {
      map.getView().setCenter(toMapCoordinate(position));
    },
    zoom(level: number) { map.getView().setZoom(level) }
  };
};
