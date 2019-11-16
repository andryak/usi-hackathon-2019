let selectedInfoWindow = null;

export default (map, maps, title, lat, lng)=> {
  const marker = new maps.Marker({
    position: {
      lat: Number(lat),
      lng: Number(lng)
    },
    map: map,
    title
  });

  marker.addListener('click', () => {
    const infoWindow = new maps.InfoWindow({
      content: title
    });
    if (selectedInfoWindow) {
      selectedInfoWindow.close();
    }
    selectedInfoWindow = infoWindow;
    infoWindow.open(map, marker);
  });
}
