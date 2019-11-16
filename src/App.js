import React, { useEffect, useState } from 'react';
import Sidebar from './components/sidebar';
import styles from './App.module.css';
import classNames from 'classnames';
import Map from './components/map';
// import useFetch from './hooks/useFetch';
import getData from './data/getData';

const App = () => {
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

  const [mapHandler, setMapHandler] = useState(null);
  const luganoStations = getData('stations');

  useEffect(() => {
    if(mapHandler && luganoStations){
      console.log(luganoStations)
    }
  },[mapHandler,luganoStations]);

  const showDirection = (map, maps, origin, destination) => {
    const directionsService = new maps.DirectionsService();
    const directionsDisplay = new maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsService.route({
        travelMode: 'BICYCLING',
        origin,
        destination,
      }, (res, status) => {
        if (status === 'OK') {
          directionsDisplay.setDirections(res);
        } else {
          new Error('Error: ' + status);
        }
      }
    );
  };

  return (
    <div className={classNames('App', styles.container)}>
      <Sidebar className={styles.sidebar} />
      <main className={styles.mainPanel}>
        <Map
          onApiLoaded={async (map, maps) => {
            setMapHandler(map);
            const currentPosition = await getCurrentPosition();
            await showDirection(map, maps, currentPosition, 'massagno');
            await map.setCenter(currentPosition);
          }}
        />
      </main>
    </div>
  );
};

export default App;
