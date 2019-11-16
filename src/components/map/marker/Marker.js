import PropTypes from 'prop-types';
import React from 'react';

const Marker = ({ text }) => (
  <div>{text}</div>
);

Marker.propTypes = {
  text: PropTypes.string,
};

export default Marker;
