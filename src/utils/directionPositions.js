const position = {
  startPos: null,
  destPos: null
};

const markers = {
  startMarker : null,
  destMarker : null,
};

function setStart(latitude) {
  position.startPos = latitude;
}

function setDest(longitude) {
  position.destPos = longitude;
}

function setStartMarker(marker) {
  markers.startMarker = marker;
}

function setDestMarker(marker) {
  markers.destMarker = marker;
}

function getPositions() {
  return position
}

function getMarkers(){
  return markers
}

export default  {
  setStart,
  setDest,
  getPositions,
  getMarkers,
  setStartMarker,
  setDestMarker
}

