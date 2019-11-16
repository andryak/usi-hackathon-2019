import showDirections from './showDirections';
import directionPositions from './directionPositions';
import shortestPath from './shortestPath';

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
        const formName = dest? 'to-place': 'from-place';
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
            .then(x => {
              console.log(x);
            });
          // showDirections(map, maps, directionPositions.startPos, directionPositions.destPos);
        }
        marker = new maps.Marker({
          position: location
        });
        marker.setMap(map);
        map.panTo(marker.position);
      }
    })(place);
    searchBox.set('map', map);
  });
};

export default addGoogleSearchBox;
