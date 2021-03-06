const position = {
  startPos: null,
  destPos: null
};

const markers = {
  startMarker : null,
  destMarker : null,
};

const places = {
  startPlace: null,
  destPlace: null,
};

const polylines = {
  shortest: null,
  alternative: null,
};

function setShortestPath(path) {
  polylines.shortest = path;
}

function setAlternativePath(path) {
  polylines.alternative = path;
}

function getPolylines() {
  return polylines
}

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

function setStartPlace(place) {
  places.startPlace = place;
}

function setDestPlace(place) {
  places.destPlace = place;
}

function getPositions() {
  return position
}

function getMarkers(){
  return markers
}

function getPlaces() {
  return places
}

export default  {
  setShortestPath,
  setAlternativePath,
  getPolylines,
  setStart,
  setDest,
  getPositions,
  getMarkers,
  setStartMarker,
  setDestMarker,
  setStartPlace,
  setDestPlace,
  getPlaces,
}

