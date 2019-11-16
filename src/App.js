import React, { useRef, useEffect, useState } from 'react';
import Sidebar from './components/sidebar';
import styles from './App.module.css';
import classNames from 'classnames';
import Map from './components/map';
import getData from './data/getData';
import getPosition from './utils/getPosition';
import createUniqueMarker from './utils/createUniqueMarker';
import addGoogleSearchBox from './utils/addGoogleSearchBox';
const stationLogo = require('./assets/station_marker.svg');

const App = () => {
  const [mapHandler, setMapHandler] = useState(null);
  const luganoStations = getData('stations');
  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    if(mapHandler && mapHandler.map && luganoStations) {
      for (const station of Object.values(luganoStations)) {
        const { name: title, latitude, longitude } = station;
        createUniqueMarker(mapHandler.map, mapHandler.maps, title, latitude, longitude, stationLogo);
      }
    }
  },[mapHandler, luganoStations]);

  return (
    <div className={classNames('App', styles.container)}>
      <Sidebar className={styles.sidebar} fromRef={fromRef} toRef={toRef} />
      <main className={styles.mainPanel}>
        <Map
          onApiLoaded={async (map, maps) => {
            const currentPosition = await getPosition();
            addGoogleSearchBox(map, maps, fromRef, toRef);
            map.setCenter(currentPosition);
            setMapHandler({ map, maps });
          }}
        />
      </main>
    </div>
  );
};

export default App;
