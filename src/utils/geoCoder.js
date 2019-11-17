import directionPositions from './directionPositions';
import getPosition from './getPosition';
import createUniqueMarker from './createUniqueMarker';
const positionMarker = require('../assets/position_marker.svg');
const flagIcon = require('../assets/position_marker.svg');

export default async (mapHandler, inputRef, kind) => {
  const geocoder = new mapHandler.maps.Geocoder();
  const currentPosition = await getPosition();

  let markerIcon;
  if (kind === 'start') {
    directionPositions.setStart(currentPosition)
    directionPositions.setStartPlace('your location')
    markerIcon = positionMarker;
  } else {
    directionPositions.setDest(currentPosition)
    directionPositions.setDestPlace('your location')
    markerIcon = flagIcon;
  }

  geocoder.geocode({'location': currentPosition}, (results, status) => {
    if (status === 'OK') {
      if (results[0]) {
        inputRef.current.value = results[0].formatted_address;

        const marker = createUniqueMarker(
          mapHandler.map,
          mapHandler.maps,
          '',
          currentPosition.lat,
          currentPosition.lng,
          markerIcon,
          true,
        );
        marker.setMap(mapHandler.map);
        marker.setZIndex(9999);
        if(kind === 'from') {
          directionPositions.setStartMarker(marker);
        } else {
          directionPositions.setDestMarker(marker);
        }
        mapHandler.map.panTo(currentPosition);
      } else {
        new Error('No results found');
      }
    } else {
      new Error('Geocoder failed due to: ' + status);
    }
  });
}
