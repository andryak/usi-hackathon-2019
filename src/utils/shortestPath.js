import stations from '../data/stations';
import stationToStationDirections from '../data/stationToStationDirections';
import geodistance from './geodistance';
import memo from './memo';
import mightHaveFewBikesAt from './mightHaveFewBikesAt';

const getDirections = memo(
  (maps, startCoords, endCoords, transport) => new Promise((resolve, reject) => {
    const directionsService = new maps.DirectionsService();
    directionsService.route({
      travelMode: transport,
      origin: new maps.LatLng(startCoords.lat, startCoords.lng),
      destination: new maps.LatLng(endCoords.lat, endCoords.lng),
    }, (result, status) => {
      if (status === 'OK') {
        resolve({
          transport,
          overviewPath: result.routes[0].overview_path.map(point => ({
            lat: point.lat(),
            lng: point.lng(),
          })),
          duration: result.routes[0].legs
            .map(leg => leg.duration.value)
            .reduce((acc, value) => acc + value, 0),
          distance: result.routes[0].legs
            .map(leg => leg.distance.value)
            .reduce((acc, value) => acc + value, 0),
        });
      } else {
        reject(status);
      }
    });
  }),
);

const knn = (stations, point, k = 3) => stations
  .slice()
  .sort((s1, s2) => geodistance(s1.coords, point) - geodistance(s2.coords, point))
  .slice(0, k);

const getCompositeRouteDuration = compositeRoute => compositeRoute
  .map(({ duration }) => duration)
  .reduce((acc, value) => acc + value, 0);

const shortestPath = async (maps, startCoords, endCoords, time) => {
  const startStations = knn(stations, startCoords);
  const endStations = knn(stations, endCoords);

  const compositeRoutes = [];
  for (let startStation of startStations) {
    for (let endStation of endStations) {
      if (startStation.id === endStation.id) {
        continue;
      }

      const fromStartToStartStationDirections = await getDirections(maps, startCoords, startStation.coords, 'WALKING');
      const fromStartStationToEndStationDirections = stationToStationDirections[startStation.id][endStation.id];
      const fromEndStationToEndDirections = await getDirections(maps, endStation.coords, endCoords, 'WALKING');
      compositeRoutes.push([
        {
          overviewPath: fromStartToStartStationDirections.overviewPath,
          duration: fromStartToStartStationDirections.duration,
          distance: fromStartToStartStationDirections.distance,
          transport: 'WALKING',
        },
        {
          overviewPath: fromStartStationToEndStationDirections.overviewPath,
          duration: fromStartStationToEndStationDirections.duration,
          distance: fromStartStationToEndStationDirections.distance,
          stations: {
            from: startStation,
            end: endStation,
          },
          transport: 'BICYCLING',
        },
        {
          overviewPath: fromEndStationToEndDirections.overviewPath,
          duration: fromEndStationToEndDirections.duration,
          distance: fromEndStationToEndDirections.distance,
          transport: 'WALKING',
        },
      ]);
    }
  }

  const compositeRouteByDuration = compositeRoutes
    .slice()
    .sort((cr1, cr2) => getCompositeRouteDuration(cr1) - getCompositeRouteDuration(cr2));

  const shortestCompositeRoute = compositeRouteByDuration[0];

  const onFootDirectRoute = await getDirections(maps, startCoords, endCoords, 'WALKING');
  if (onFootDirectRoute.duration < getCompositeRouteDuration(shortestCompositeRoute)) {
    return {
      shortest: [onFootDirectRoute],
      alternative: undefined, // FIXME: returns hortest alternative.
    };
  }

  if (mightHaveFewBikesAt(shortestCompositeRoute[1].stations.end, time)) {
    return {
      shortest: shortestCompositeRoute,
      alternative: undefined,
    };
  }

  const shortestAlternativeCompositeRoute = compositeRouteByDuration
    .find(cr => mightHaveFewBikesAt(cr[1].stations.end, time));

  return {
    shortest: shortestCompositeRoute,
    alternative: shortestAlternativeCompositeRoute,
  };
};

export default shortestPath;
