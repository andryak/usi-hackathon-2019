import geodistance from './geodistance';
import memo from './memo';

// TODO get from file.
const stations = [];

// TODO get from file.
const stationToStationDirections = {};

const mightHaveFewBikesAt = (station, time) => (
  station.availability[time.weekDay][time.hour] < 5
);

const getDirections = memo(
  (startCoords, endCoords, transport) => Google.getRoute(startCoords, endCoords, transport),
);

const knn = (stations, point, k = 3) => stations
  .slice()
  .sort((s1, s2) => geodistance(s1.coords, point) - geodistance(s2.coords, point))
  .slice(0, k);

const getCompositeRouteDuration = compositeRoute => compositeRoute
  .map(({ duration }) => duration)
  .reduce((acc, value) => acc + value, 0);

const shortestPath = (startCoords, endCoords, time) => {
  const startStations = knn(stations, startCoords);
  const endStations = knn(stations, endCoords);

  const compositeRoutes = [];
  startStations.forEach(startStation => {
    endStations.forEach(endStation => {
      const fromStartToStartStationDirections = getDirections(startCoords, startStation.coords, 'foot');
      const fromStartStationToEndStationDirections = stationToStationDirections[startStation.id][endStation.id];
      const fromEndStationToEndDirections = getDirections(endStation.coords, endCoords, 'foot');
      compositeRoutes.push([
        {
          overviewPath: fromStartToStartStationDirections.overview_path,
          // FIXME if not available
          duration: fromStartToStartStationDirections.duration,
          transport: 'foot',
        },
        {
          overviewPath: fromStartStationToEndStationDirections.overview_path,
          // FIXME if not available
          duration: fromStartStationToEndStationDirections.duration,
          stations: {
            from: startStation,
            end: endStation,
          },
          transport: 'bike',
        },
        {
          overviewPath: fromEndStationToEndDirections.overview_path,
          // FIXME if not available
          duration: fromEndStationToEndDirections.duration,
          transport: 'foot',
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
