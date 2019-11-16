import React from 'react';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import styles from './Map.module.css';

const LUGANO_COORDS = {
  lat: 46.01008,
  lng: 8.96004
};

const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_KEY;

const Map = ({ qdefaultCenter, defaultZoom, onApiLoaded, publibikeStations }) => (
  <div className={styles.map}>
    <GoogleMapReact
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({ map, maps }) => onApiLoaded(map, maps)}
      bootstrapURLKeys={{ key: GOOGLE_KEY }}
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
  defaultZoom: 14,
};

export default Map;
