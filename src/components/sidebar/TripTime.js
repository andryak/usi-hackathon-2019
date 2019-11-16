import React from 'react';
import PropTypes from 'prop-types';
import {DirectionsBikeOutlined, DirectionsWalkOutlined} from '@material-ui/icons';
import styles from './Sidebar.module.css';

const fancyTimeFormat = time => {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;
    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = '';
    if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }
    ret += '' + mins === '0' ? '1' : mins;
    ret += ' min';
    return ret;
};

const TripTime = ({path}) => {
    const {transport, duration} = path;
    console.log('xxx path', path);
    return (
        <div className={styles.tripTimeContainer}>
            {transport === 'WALKING'
                ? <DirectionsWalkOutlined fontSize={'large'} className={styles.tripTimeIcon}/>
                : <DirectionsBikeOutlined fontSize={'large'} className={styles.tripTimeIcon}/>
            }
            <span className={styles.tripDuration}>{fancyTimeFormat(duration)}</span>
        </div>
    )
};

TripTime.propTypes = {
    path: PropTypes.any,
    transport: PropTypes.any,
    duration: PropTypes.any,

};

export default TripTime;

