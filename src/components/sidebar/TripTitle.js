import React from 'react';
import PropTypes from 'prop-types';
import fancyTimeFormat from './fancyTimeFormat';
import fancyDistanceFormat from './fancyDistanceFormat';
import styles from './Sidebar.module.css';

const TripTitle = ({ from, to, duration, distance }) => (
  <div className={styles.tripTitle}>
    <span>{'From '}</span>
    <span className={styles.tripTitleHighlight}>{from}</span>
    <span>{' to '}</span>
    <span className={styles.tripTitleHighlight}>{to}</span>
    <span>{', '}</span>
    <span className={styles.tripTitleHighlight}>{fancyTimeFormat(duration)}</span>
    <span>{' ('}</span>
    <span>{fancyDistanceFormat(distance)}</span>
    <span>{')'}</span>
  </div>
);

TripTitle.propTypes = {
    from: PropTypes.string,
    to: PropTypes.string,
    duration: PropTypes.number,
    distance: PropTypes.number,
};

export default TripTitle;
