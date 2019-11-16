import React, { useEffect, useState } from 'react';
import Sidebar from './components/sidebar';
import styles from './App.module.css';
import classNames from 'classnames';
import Map from './components/map';
// import useFetch from './hooks/useFetch';
import getData from './data/getData';
import getPosition from './utils/getPosition';
import showDirections from './utils/showDirections';
import createUniqueMarker from './utils/createUniqueMarker';

const App = () => {
  const [mapHandler, setMapHandler] = useState(null);
  const luganoStations = getData('stations');

  useEffect(() => {
    if(mapHandler && mapHandler.map && luganoStations) {
      for (const station of Object.values(luganoStations)) {
        const {name: title, latitude, longitude} = station;
        createUniqueMarker(mapHandler.map, mapHandler.maps, title, latitude, longitude);
      }
    }
  },[mapHandler, luganoStations]);

  return (
    <div className={classNames('App', styles.container)}>
      <Sidebar className={styles.sidebar} />
      <main className={styles.mainPanel}>
        <Map
          onApiLoaded={async (map, maps) => {
            setMapHandler({ map, maps });
            const currentPosition = await getPosition();
            await showDirections(map, maps, currentPosition, 'massagno');
            await map.setCenter(currentPosition);
          }}
        />
      </main>
    </div>
  );
};

export default App;
