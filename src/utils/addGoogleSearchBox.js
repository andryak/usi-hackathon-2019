import directionPositions from './directionPositions';
import shortestPath from './shortestPath';
import createUniqueMarker from './createUniqueMarker';
const positionMarker = require('../assets/position_marker.svg');

let originMarker = null;
let destinationMarker = null;
let paths = null;
let alternativePaths = null;

const addGoogleSearchBox = (map, maps, fromRef, toRef) => {
  const originSearchBox = new maps.places.SearchBox(fromRef.current);
  const destinationSearchBox = new maps.places.SearchBox(toRef.current);
  const searchBounds = new maps.LatLngBounds(
    new maps.LatLng(45.917775, 8.873512),
    new maps.LatLng(46.069719, 9.035068)
  );
  addSearchListener(originSearchBox, map, maps, originMarker, false);
  addSearchListener(destinationSearchBox, map, maps, destinationMarker, true);
  originSearchBox.setBounds(searchBounds);
  destinationSearchBox.setBounds(searchBounds);
};

const addSearchListener = (searchBox, map, maps, marker, dest) => {
  let location = null;
  maps.event.addListener(searchBox, 'places_changed', () => {
    searchBox.set('map', null);
    let place = searchBox.getPlaces()[0];
    (place => {
      if (marker) {
        marker.setMap(null);
      }
      location = place.geometry.location;
      if (!searchBox.getBounds().contains(location)) {
        const formName = dest ? 'to-place': 'from-place';
        document.getElementById(formName).value='';
        alert('Please chose a location between Lugano and surroundings.')
      } else {
        if (dest) {
          directionPositions.destPos = {lat: location.lat(), lng: location.lng()};
        } else {
          directionPositions.startPos = {lat: location.lat(), lng: location.lng()};
        }
        if (directionPositions.destPos && directionPositions.startPos) {
          shortestPath(
            maps,
            directionPositions.startPos,
            directionPositions.destPos,
            { weekDay: 'monday', hour: '12' },
          )
            .then(result => {
              if(paths) {
                paths.forEach(path => path.setMap(null));
              }
              if (alternativePaths){
                alternativePaths.forEach((path => path.setMap(null)));
              }


              var lineSymbol = {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 5,
            };
              // Draw shortest path first.
              paths = result.shortest.map(({ transport, overviewPath }) => new maps.Polyline({
                path: overviewPath,
                geodesic: true,
                strokeColor:'#a328a2',
                strokeOpacity: transport === 'WALKING' ? 0:1,
                strokeWeight: 7,
                icons: [{
                  icon: lineSymbol,
                  offset: '0',
                  repeat: '20px'
                }],

            }));

             if (result.alternative){
               alternativePaths = result.alternative.map(({ transport, overviewPath }) => new maps.Polyline({
                path: overviewPath,
                geodesic: true,
                strokeColor: '#b4b4b4',
                strokeOpacity: 1,
                strokeWeight: 5
              }));
               alternativePaths.forEach(path => path.setMap(map))
             }

              paths.forEach(path => path.setMap(map))
            });
          // showDirections(map, maps, directionPositions.startPos, directionPositions.destPos);
        }
        const title = dest ? 'Destination': 'Starting position';
        marker = createUniqueMarker(map, maps, title, location.lat(), location.lng(), positionMarker, true);
        marker.setMap(map);
        map.panTo(marker.position);
      }
    })(place);
    searchBox.set('map', map);
  });
};

export default addGoogleSearchBox;
