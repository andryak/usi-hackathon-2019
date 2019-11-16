import showDirections from './showDirections';

let originMarker = null;
let destinationMarker = null;

const addGoogleSearchBox = (map, maps, fromRef, toRef) => {
  const originSearchBox = new maps.places.SearchBox(fromRef.current);
  const destinationSearchBox = new maps.places.SearchBox(toRef.current);
  const searchBounds = new maps.LatLngBounds(
    new maps.LatLng(45.938987, 8.894772),
    new maps.LatLng(46.030923, 8.991668)
  );
  let originLocation = addSearchListener(originSearchBox, map, maps, originMarker);
  let destinationLocation = addSearchListener(destinationSearchBox, map, maps, destinationMarker);
  originSearchBox.setBounds(searchBounds);
  destinationSearchBox.setBounds(searchBounds);
  return {originLocation, destinationLocation}
};

const addSearchListener = (searchBox, map, maps, marker) => {
  let location = null;
  maps.event.addListener(searchBox, 'places_changed', () => {
    searchBox.set('map', null);

    let place = searchBox.getPlaces()[0];
    (place => {
      if (marker) {
        marker.setMap(null);
      }
      location = place.geometry.location;
      marker = new maps.Marker({
        position: location
      });
      if (map.getBounds().contains(marker.getPosition())) {
        marker.setMap(map);
        map.setCenter(marker.position);
        map.setZoom(16);
      } else {
        marker.setMap(null);
      }
    })(place);
    searchBox.set('map', map);
  });
  return location;
};

export default addGoogleSearchBox;