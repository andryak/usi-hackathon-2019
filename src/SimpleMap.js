import React from 'react';
import GoogleMapReact from 'google-map-react';

const simpleProps = {
  center: {
    lat: 46.01008,
    lng: 8.96004
  },
  zoom: 14
};

const SimpleMap = () => (
  <div style={{ height: '100vh', width: '100%' }}>
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_KEY }}
      defaultCenter={simpleProps.center}
      defaultZoom={simpleProps.zoom}
    />
  </div>
);

export default SimpleMap;