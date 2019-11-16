export default (map, maps, origin, destination) => {
  const directionsService = new maps.DirectionsService();
  const directionsDisplay = new maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  directionsService.route({
      travelMode: 'BICYCLING',
      origin,
      destination,
    }, (res, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(res);
      } else {
        new Error('Error: ' + status);
      }
    }
  );
};
