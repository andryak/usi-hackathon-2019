import showDirections from './showDirections';
import directionPositions from './directionPositions';

let originMarker = null;
let destinationMarker = null;

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
        alert('Please chose a location between Lugano and surroundings.')
      } else {
        if (dest) {
          directionPositions.destPos = location;
        } else {
          directionPositions.startPos = location;
        }
        if (directionPositions.destPos && directionPositions.startPos) {
          showDirections(map, maps, directionPositions.startPos, directionPositions.destPos);
        }
        marker = new maps.Marker({
          position: location
        });
        marker.setMap(map);
        map.setCenter(marker.position);
        map.setZoom(16);
      }
    })(place);
    searchBox.set('map', map);
  });
};

export default addGoogleSearchBox;