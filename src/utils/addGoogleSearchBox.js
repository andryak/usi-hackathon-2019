const addGoogleSearchBox = (map, maps, fromRef, toRef) => {
  const originSearchBox = new maps.places.SearchBox(fromRef.current);
  const destinationSearchBox = new maps.places.SearchBox(toRef.current);
  const searchBounds = new maps.LatLngBounds(
    new maps.LatLng(45.938987, 8.894772),
    new maps.LatLng(46.030923, 8.991668)
  );
  originSearchBox.setBounds(searchBounds);
  destinationSearchBox.setBounds(searchBounds);
  maps.event.addListener(originSearchBox, 'places_changed', function() {
    originSearchBox.set('map', null);

    let places = originSearchBox.getPlaces();

    let i, place;
    for (i = 0; i < 1; i++) {
      place = places[i];
      (place => {
        let marker = new maps.Marker({
          position: place.geometry.location
        });
        marker.bindTo('map', originSearchBox, 'map');
        maps.event.addListener(marker, 'map_changed', () => {
          // FIXME
        });
        map.setCenter(marker.position);
      })(place);
    }
    originSearchBox.set('map', map);
    map.setZoom(16);
  });
};

export default addGoogleSearchBox;