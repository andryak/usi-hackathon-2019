import React from 'react';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import styles from './Map.module.css';
import stylesMap from './stylesMap';

const LUGANO_COORDS = {
  lat: 46.01008,
  lng: 8.96004
};

const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_KEY;

const Map = ({ defaultCenter, defaultZoom, onApiLoaded, publibikeStations }) => (
  <div className={styles.map}>
    <GoogleMapReact
      options={{
        styles: stylesMap,
      }}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({ map, maps }) => onApiLoaded(map, maps)}
      bootstrapURLKeys={{ key: GOOGLE_KEY, libraries: ['places'] }}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
    />
  </div>
);

const Coordinates = PropTypes.shape({
  lat: PropTypes.number,
  lng: PropTypes.number,
});

Map.propTypes = {
  defaultCenter: Coordinates,
  defaultZoom: PropTypes.number,
  onApiLoaded: PropTypes.func,
  publibikeStations: PropTypes.arrayOf(Coordinates)
};

Map.defaultProps = {
  defaultCenter: LUGANO_COORDS,
  defaultZoom: 16,
};

export default Map;
