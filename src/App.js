import React, { useRef, useEffect, useState } from 'react';
import Sidebar from './components/sidebar';
import styles from './App.module.css';
import classNames from 'classnames';
import Map from './components/map';
import getData from './data/getData';
import getPosition from './utils/getPosition';
import createUniqueMarker from './utils/createUniqueMarker';
import addGoogleSearchBox, {runShortestPathAlg} from './utils/addGoogleSearchBox';
import mightHaveFewBikesAt from './utils/mightHaveFewBikesAt';
import getTime from './utils/getTime';
const stationLogo = require('./assets/station_marker.svg');
const hotStationLogo = require('./assets/station_marker_hot.svg');
const luganoStations = getData('stations');

const App = () => {
  const [mapHandler, setMapHandler] = useState(null);
  const [paths, setPaths] = useState(null);

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
        paths={paths}
        mapHandler={mapHandler}
      />
      <main className={styles.mainPanel}>
        <Map
          onApiLoaded={async (map, maps) => {
            const currentPosition = await getPosition();
            addGoogleSearchBox(map, maps, fromRef, toRef, setPaths);
            map.panTo(currentPosition);
            setMapHandler({ map, maps });
          }}
        />
      </main>
    </div>
  );
};

export default App;
