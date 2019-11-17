import directionPositions from './directionPositions';
import shortestPath from './shortestPath';
import createUniqueMarker from './createUniqueMarker';
import getTime from './getTime';
const positionMarker = require('../assets/position_marker.svg');
const flagIcon = require('../assets/position_marker.svg');

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
  map.fitBounds(bounds, 70);

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
        // Draw alternative path, so that it might later be overridden by the shortest path.
      }

      let lineSymbol = {
        path: 'M 0,-0.25 0.25,0 0,0.25 -0.25,0 0,-0.25',
        strokeOpacity: 0.5,
      };

      const pathsOffset = 0.00002;
      const totalSeconds = 2000; // total seconds to animate the path
      if (result.alternative) {
        let totalStepsAlternative = result.alternative.reduce((acc, { overviewPath }) => acc += overviewPath.length, 0);
        const animationDelayAlternative = totalSeconds/totalStepsAlternative;
        alternativePaths = result.alternative.map(({ transport, overviewPath }, index) => {
          let delay = 0;
          for ( let pathIndex = 0; pathIndex < index; ++pathIndex) {
            delay += animationDelayAlternative * result.alternative[pathIndex].overviewPath.length;
          }
          const pathPolyLine = new maps.Polyline({
            geodesic: true,
            strokeOpacity: transport === 'WALKING' ? 0 : 0.5,
            strokeColor: 'rgb(255,96,0)',
            strokeWeight: 4,
            ...(transport === 'WALKING' && {icons: [{icon: lineSymbol, offset: '10px', repeat: '10px'}]}),
          });
          let animatedPath = new maps.MVCArray();
          for ( let i = 0; i < overviewPath.length; i++) {
            const currentCoord = new maps.LatLng(
              `${overviewPath[i].lat + (i === 0 ? 0 : pathsOffset)}`,
              `${overviewPath[i].lng + (i === 0 ? 0 : pathsOffset)}`
            );
            if (i === 0) {
              animatedPath.push(currentCoord);
              pathPolyLine.setPath(animatedPath);
            } else {
              setTimeout(() => {
                animatedPath.push(currentCoord);
              }, (animationDelayAlternative * i) + delay);
            }
          }
          return pathPolyLine;
        });
        directionPositions.setAlternativePath(alternativePaths);
        alternativePaths.forEach(path => path.setMap(map))
      }

      // Draw shortest path
      let totalStepsShortest = result.shortest.reduce((acc, { overviewPath }) => acc += overviewPath.length, 0);
      const animationDelayShortest = totalSeconds/totalStepsShortest;
      paths = result.shortest.map(({ transport, overviewPath }, index) => {
        let delay = 0;
        for ( let pathIndex = 0; pathIndex < index; ++pathIndex) {
          delay += animationDelayShortest * result.shortest[pathIndex].overviewPath.length;
        }
        const pathPolyLine = new maps.Polyline({
          geodesic: true,
          strokeOpacity: transport === 'WALKING' ? 0 : 0.5,
          strokeColor: 'rgb(11, 104, 255)',
          strokeWeight: 6,
          ...(transport === 'WALKING' && { icons: [{ icon: lineSymbol, offset: '0', repeat: '10px' }]}),
        });

        let animatedPath = new maps.MVCArray();
        for ( let i = 0; i < overviewPath.length; i++) {
          const currentCoord = new maps.LatLng(
            `${overviewPath[i].lat - (i === 0 ? 0 : pathsOffset)}`,
            `${overviewPath[i].lng - (i === 0 ? 0 : pathsOffset)}`
          );
          if (i === 0) {
            animatedPath.push(currentCoord);
            pathPolyLine.setPath(animatedPath);
          } else {
            setTimeout(() => {
              animatedPath.push(currentCoord);
            }, (animationDelayShortest * i) + delay);
          }
        }
        return pathPolyLine;
      });
      directionPositions.setShortestPath(paths);
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
  let marker;
  let markerIcon;
  if(kind === 'from') {
    marker=startMarker;
    markerIcon = positionMarker;
  } else {
    marker= destMarker;
    markerIcon = flagIcon;
  }

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
        directionPositions.setDestPlace(place.name);
      } else {
        directionPositions.setStart( {
          lat: location.lat(),
          lng: location.lng(),
        });
        directionPositions.setStartPlace(place.name);
      }

      marker = createUniqueMarker(
        map,
        maps,
        '',
        location.lat(),
        location.lng(),
        markerIcon,
        true,
        true
      );
      marker.setMap(map);
      marker.setZIndex(9999);
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
