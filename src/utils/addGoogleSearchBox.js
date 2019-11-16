import directionPositions from './directionPositions';
import shortestPath from './shortestPath';
import createUniqueMarker from './createUniqueMarker';
import getTime from './getTime';
const positionMarker = require('../assets/position_marker.svg');

let { startMarker, destMarker } = directionPositions.getMarkers();
let paths = null;
let alternativePaths = null;

export const runShortestPathAlg = (map, maps, onPathFound) => {
  const {startPos, destPos} = directionPositions.getPositions();
  if (!startPos || !destPos) {
    // FIXME deduce from inputs.
    return;
  }

  // Fit both the starting point and the destination into the map.
  const bounds = new maps.LatLngBounds();
  bounds.extend(new maps.LatLng(startPos.lat, startPos.lng));
  bounds.extend(new maps.LatLng(destPos.lat, destPos.lng));
  map.fitBounds(bounds);

  shortestPath(
    maps,
    startPos,
    destPos,
    getTime(new Date()),
  )
    .then(result => {
      if(paths) {
        paths.forEach(path => path.setMap(null));
      }
      if (alternativePaths){
        alternativePaths.forEach((path => path.setMap(null)));
      }

      var lineSymbol = {
        path: 'M 0,-0.25 0.25,0 0,0.25 -0.25,0 0,-0.25',
        strokeOpacity: 1,
      };

      // Draw alternative path, so that it might later be overridden by the shortest path.
      if (result.alternative) {
        alternativePaths = result.alternative.map(({ transport, overviewPath }) => new maps.Polyline({
          path: overviewPath,
          geodesic: true,
          strokeOpacity: transport === 'WALKING' ? 0 : 1,
          strokeColor: 'rgb(255,96,0)',
          strokeWeight: 4,
          ...(transport === 'WALKING' && { icons: [{ icon: lineSymbol, offset: '10px', repeat: '10px' }]}),
        }));
        alternativePaths.forEach(path => path.setMap(map))
      }

      // Draw shortest path
      paths = result.shortest.map(({ transport, overviewPath }) => new maps.Polyline({
        path: overviewPath,
        geodesic: true,
        strokeOpacity: transport === 'WALKING' ? 0 : 1,
        strokeColor: 'rgb(11, 104, 255)',
        strokeWeight: 4,
        ...(transport === 'WALKING' && { icons: [{ icon: lineSymbol, offset: '0', repeat: '10px' }]}),
      }));
      paths.forEach(path => path.setMap(map));
      onPathFound(result);

    });
};

const addGoogleSearchBox = (map, maps, fromRef, toRef) => {
  const fromSearchBox = new maps.places.SearchBox(fromRef.current);
  const toSearchBox = new maps.places.SearchBox(toRef.current);

  addSearchListener(fromSearchBox, map, maps, 'from');
  addSearchListener(toSearchBox, map, maps, 'to');

  const searchBounds = new maps.LatLngBounds(
    new maps.LatLng(45.917775, 8.873512),
    new maps.LatLng(46.069719, 9.035068),
  );
  fromSearchBox.setBounds(searchBounds);
  toSearchBox.setBounds(searchBounds);
};

const addSearchListener = (searchBox, map, maps, kind) => {
  let marker = kind === 'from' ? startMarker : destMarker;

  let location = null;
  maps.event.addListener(searchBox, 'places_changed', () => {
    searchBox.set('map', null);
    let place = searchBox.getPlaces()[0];
    if (marker) {
      marker.setMap(null);
    }
    location = place.geometry.location;
    if (!searchBox.getBounds().contains(location)) {
      alert('Please chose a location between Lugano and surroundings.')
    } else {
      if (kind === 'to') {
        directionPositions.setDest({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        directionPositions.setStart( {
          lat: location.lat(),
          lng: location.lng(),
        });
      }

      marker = createUniqueMarker(
        map,
        maps,
        '',
        location.lat(),
        location.lng(),
        positionMarker,
        true,
      );
      marker.setMap(map);
      if(kind === 'from') {
        directionPositions.setStartMarker(marker);
      }else{
        directionPositions.setDestMarker(marker);
      }
    }
    searchBox.set('map', map);
    map.panTo(location);



  });
};

export default addGoogleSearchBox;
