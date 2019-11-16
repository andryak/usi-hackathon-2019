const getCurrentPosition = () => new Promise((resolve, reject) => {
  if (!navigator.geolocation) {
    reject(new Error('Geolocation is not available'));
  }
  navigator.geolocation.getCurrentPosition(position => {
    resolve({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  }, reject);
});

export default getCurrentPosition;