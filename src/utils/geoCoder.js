import directionPositions from './directionPositions';
import getPosition from './getPosition';
import createUniqueMarker from './createUniqueMarker';
const positionMarker = require('../assets/position_marker.svg');

export default async (mapHandler, inputRef, kind) => {
  const geocoder = new mapHandler.maps.Geocoder();
  const currentPosition = await getPosition();

  if (kind === 'start') {
    directionPositions.setStart(currentPosition)
  } else {
    directionPositions.setDest(currentPosition)
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
          positionMarker,
          true,
        );
        marker.setMap(mapHandler.map);
        if(kind === 'from') {
          directionPositions.setStartMarker(marker);
        }else{
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
