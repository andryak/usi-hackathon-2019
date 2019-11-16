const stations = [
  {
    id: 0,
    name: 'USI',
    coords: {
      lat: 46.01008,
      lng: 8.96004,
    },
    availability: {
      monday: {
        '00:00': 4,
        '01:00': 3,
        '02:00': 2,
        '03:00': 5,
        '04:00': 2,
        '05:00': 1,
        '06:00': 3,
        '07:00': 0,
      },
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {},
      sunday: {},
    },
  },
];

const stationToStationRoutes = {
  0: {
    1: 'PATH',
    2: 'PATH',
  },
  1: {
    0: 'PATH',
    2: 'PATH',
  },
  2: {
    0: 'PATH',
    1: 'PATH',
  },
};

const deg2rad = deg => {
  return deg * (Math.PI/180);
};

const computeDistance = (coords1, coords2) => {
  const R = 6371; // Radius of the earth in km
  const delta = {
    lat: deg2rad(coords2.lat - coords1.lat),
    lng: deg2rad(coords2.lng - coords1.lng),
  };
  const a =
    Math.sin(delta.lat / 2) * Math.sin(delta.lat / 2) +
    Math.cos(deg2rad(coords1.lat)) * Math.cos(deg2rad(coords2.lat)) *
    Math.sin(delta.lng / 2) * Math.sin(delta.lng / 2)
  ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const computePathDuration = route => (
  0 // TODO
);

const pathHasReward = route => (
  true // TODO
);



// Coords:
//  - lat: number
//  - lng: number

// Station:
//  - id: string
//  - coords: Coords

// RouteBike:
//  - overviewPath
//  - duration: number (ms)
//  - transport: 'BIKE'
//  - stations:
//     - from: Station
//     - to: Station

// RouteFoot:
//  - overviewPath
//  - duration: number (ms)
//  - transport: 'FOOT'

// Route = RouteBike | RouteFoot

// CompositeRoute = Route[]

// Solutions:
//  - shortest: CompositeRoute
//  - reward: CompositeRoute

const shortestPath = (start, end) => {
  const stationsWithDistance = stations.map(station => ({
    ...station,
    distanceFromStart: computeDistance(station.coords, start),
    distanceFromEnd: computeDistance(station.coords, end),
  }));

  const K = 3;
  const stationsClosestToStart = stationsWithDistance
    .slice()
    .sort((station1, station2) => station1.distanceFromStart - station2.distanceFromStart)
    .slice(0, K);
  const stationsClosestToEnd = stationsWithDistance
    .slice()
    .sort((station1, station2) => station1.distanceFromEnd - station2.distanceFromEnd)
    .slice(0, K);

  const stationsWithRouteFromStart = stationsClosestToStart.map(station => ({
    ...station,
    route: Google.getRoute(start, station, 'foot'),
  }));
  const stationsWithRouteToEnd = stationsClosestToEnd.map(station => ({
    ...station,
    route: Google.getRoute(station, end, 'foot'),
  }));

  const potentialPaths = [];
  stationsWithRouteFromStart.forEach(startStation => {
    stationsWithRouteToEnd.forEach(endStation => {
      const routes = {
        start: startStation.route,
        mid: stationToStationRoutes[startStation.id][endStation.id],
        end: endStation.route,
      };
      potentialPaths.push({
        routes: routes,
        hasReward: stationHasReward(endStation)
      })
    });
  });

  const pathsByDuration = potentialPaths
    .slice()
    .sort((path1, path2) => computePathDuration(path1) - computePathDuration(path2));
  const shortestPath = pathsByDuration[0];

  // const routeFromStartToEnd = Google.getRoute(start, end, 'foot');
  // if (computeRouteDuration(routeFromStartToEnd) < computePathDuration(shortestPath)) {
  //   // FIXME: Uniform return values.
  //   return {
  //     main: routeFromStartToEnd,
  //     alternative: shortestPathWithReward,
  //   };
  // }

  if (shortestPath.hasReward) {
    return {
      main: shortestPath,
      alternative: undefined,
    };
  }

  const shortestPathWithReward = pathsByDuration.find(path => path.hasReward);

  return {
    main: shortestPath,
    alternative: shortestPathWithReward,
  };
};
