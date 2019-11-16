import stations from './stations'

// stabbed data as we don't have currently access to their APIs
const mapData = {
  'https://api.publibike.ch/v1/public/stations/': stations
};

export default url => mapData[url];

