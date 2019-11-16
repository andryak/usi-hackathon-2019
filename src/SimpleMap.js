import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';

const simpleProps = {
  center: {
    lat: 46.01008,
    lng: 8.96004
  },
  zoom: 14
};

const Marker = ({ text }) => <div>{text}</div>;

const SimpleMap = () => {

  const apiIsLoaded = (map, maps, places)=>{
    showPosition(map);
    showDirection(map, maps);
  };

  const showDirection = (map, maps) => {
    const directionsService = new maps.DirectionsService();
    const directionsDisplay = new maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsService.route({
        travelMode: 'BICYCLING',
        origin: 'lugano',
        destination: 'massagno'
      }, (res, status) => {
        if (status === 'OK') {
          directionsDisplay.setDirections(res);
        } else {
          window.alert('Error: ' + status);
        }
      }
    );
  };

  const showPosition = (map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentPosition(pos);
        map.setCenter(pos);

      }, function (e) {
        console.log(e)
      });
    } else {
      console.log('error')
    }
  };

  const [currentPosition, setCurrentPosition] = useState(null);

  return (
    <div style={{height: '100vh', width: '100%'}}>
      <GoogleMapReact
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({map, maps}) => apiIsLoaded(map, maps)}
        bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_KEY}}
        defaultCenter={simpleProps.center}
        defaultZoom={simpleProps.zoom}

      >
        {currentPosition && <Marker
          key={1}
          text='Your Position'
          lat={currentPosition.lat}
          lng={currentPosition.lng}
        />}
      </GoogleMapReact>
    </div>
  );
};

Marker.propTypes = {
  text: PropTypes.string,
};

export default SimpleMap;
