import stations from './stations'

// stabbed data as we don't have currently access to their APIs
const mapData = {
  'stations': stations
};

export default datasetName => mapData[datasetName];

