let selectedInfoWindow = null;

const makeInfoWindow = title => (
  `<p class='infoWindow'>
    ${title}
  </p>`
);

export default (map, maps, title, lat, lng, icon, hideInfoWindow, drop=false)=> {
  const marker = new maps.Marker({
    position: {
      lat: Number(lat),
      lng: Number(lng)
    },
    map: map,
    title,
    animation: drop && maps.Animation.DROP,
    ...(icon && {icon})
  });

  if(!hideInfoWindow) {
    const infoWindow = new maps.InfoWindow({
      content: makeInfoWindow(title)
    });
    marker.addListener('click', () => {
      if (selectedInfoWindow) {
        selectedInfoWindow.close();
      }
      selectedInfoWindow = infoWindow;
      infoWindow.open(map, marker);
    });
  }
  return marker;
}
