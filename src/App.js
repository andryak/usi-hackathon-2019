import React, { useRef, useEffect, useState } from 'react';
import Sidebar from './components/sidebar';
import styles from './App.module.css';
import classNames from 'classnames';
import Map from './components/map';
import luganoStations from './data/stations';
import getPosition from './utils/getPosition';
import createUniqueMarker from './utils/createUniqueMarker';
import addGoogleSearchBox from './utils/addGoogleSearchBox';
import mightHaveFewBikesAt from './utils/mightHaveFewBikesAt';
import getTime from './utils/getTime';
const stationLogo = require('./assets/station_marker.svg');
const hotStationLogo = require('./assets/station_marker_hot.svg');

const App = () => {
  const [mapHandler, setMapHandler] = useState(null);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    if(mapHandler && mapHandler.map) {
      for (const station of luganoStations) {
        const { name, coords } = station;
        const logo =  mightHaveFewBikesAt(station, getTime(new Date()))
          ? hotStationLogo
          : stationLogo;

        createUniqueMarker(mapHandler.map, mapHandler.maps, name, coords.lat, coords.lng, logo)
      }
    }
  }, [mapHandler]);

  return (
    <div className={classNames('App', styles.container)}>
      <Sidebar
        className={styles.sidebar}
        fromRef={fromRef}
        toRef={toRef}
        mapHandler={mapHandler}
      />
      <main className={styles.mainPanel}>
        <Map
          onApiLoaded={async (map, maps) => {
            setMapHandler({ map, maps });
            addGoogleSearchBox(map, maps, fromRef, toRef);
            getPosition().then(map.panTo);
          }}
        />
      </main>
    </div>
  );
};

export default App;
