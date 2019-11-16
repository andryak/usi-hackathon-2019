import React from 'react';
import Sidebar from './components/sidebar';
import styles from './App.module.css';
import classNames from 'classnames';
import Map from './components/map';

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

  return (
    <div className={classNames('App', styles.container)}>
      <Sidebar className={styles.sidebar} />
      <main className={styles.mainPanel}>
        <Map
          onApiLoaded={async (map, maps) => {
            const currentPosition = await getCurrentPosition();
            map.setCenter(currentPosition);
          }}
        />
      </main>
    </div>
  );
};

export default App;
