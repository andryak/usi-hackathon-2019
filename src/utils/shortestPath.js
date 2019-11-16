import geodistance from './geodistance';
import memo from './memo';
import stationToStationDirections from '../data/stationToStationDirections';

// TODO get from file.
const stations = [];

const mightHaveFewBikesAt = (station, time) => (
  station.availability[time.weekDay][time.hour] < 5
);

const getDirections = memo(
  (maps, startCoords, endCoords, transport) => new Promise((resolve, reject) => {
    const directionsService = new maps.DirectionsService();
    directionsService.route({
      travelMode: transport,
      origin: new maps.LatLng(startCoords.latitude, startCoords.longitude),
      destination: new maps.LatLng(endCoords.latitude, endCoords.longitude),
    }, (result, status) => {
      if (status === 'OK') {
        resolve({
          overviewPath: result.routes[0].overview_path,
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

const shortestPath = (maps, startCoords, endCoords, time) => {
  const startStations = knn(stations, startCoords);
  const endStations = knn(stations, endCoords);

  const compositeRoutes = [];
  startStations.forEach(startStation => {
    endStations.forEach(endStation => {
      const fromStartToStartStationDirections = getDirections(maps, startCoords, startStation.coords, 'WALKING');
      const fromStartStationToEndStationDirections = stationToStationDirections[startStation.id][endStation.id];
      const fromEndStationToEndDirections = getDirections(maps, endStation.coords, endCoords, 'WALKING');
      compositeRoutes.push([
        {
          overviewPath: fromStartToStartStationDirections.overview_path,
          duration: fromStartToStartStationDirections.duration,
          transport: 'WALKING',
        },
        {
          overviewPath: fromStartStationToEndStationDirections.overview_path,
          duration: fromStartStationToEndStationDirections.duration,
          stations: {
            from: startStation,
            end: endStation,
          },
          transport: 'BICYCLING',
        },
        {
          overviewPath: fromEndStationToEndDirections.overview_path,
          duration: fromEndStationToEndDirections.duration,
          transport: 'WALKING',
        },
      ]);
    });
  });

  const compositeRouteByDuration = compositeRoutes
    .slice()
    .sort((cr1, cr2) => getCompositeRouteDuration(cr1) - getCompositeRouteDuration(cr2));

  const shortestCompositeRoute = compositeRouteByDuration[0];

  // TODO compare shortestCompositeRoute with on-foot-only path.

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
