const deg2rad = deg => {
  return deg * (Math.PI / 180);
};

const geodistance = (coords1, coords2) => {
  const R = 6371; // Radius of the earth in km
  const delta = {
    lat: deg2rad(coords2.lat - coords1.lat),
    lng: deg2rad(coords2.lng - coords1.lng),
  };
  const a =
    Math.sin(delta.lat / 2) * Math.sin(delta.lat / 2)
    + Math.cos(deg2rad(coords1.lat))
    * Math.cos(deg2rad(coords2.lat))
    * Math.sin(delta.lng / 2) * Math.sin(delta.lng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default geodistance;
