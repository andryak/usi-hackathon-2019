import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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

const fancyDistanceFormat = distance => (
    distance < 1000
      ? `${Math.round(distance)} m`
      : `${Math.round(distance / 100) / 10} km`
);

const TripTime = ({path, alternative}) => {
    const {transport, duration, distance} = path;
    return (
        <div className={styles.tripContainer}>
            <div className={classNames(styles.tripTimeContainer, transport === 'WALKING'? styles.tripWalking : styles.tripBike, alternative ? styles.alternative : styles.short)}>
                {transport === 'WALKING' ? <div className={classNames(styles.dotTop, alternative ? styles.dotAlternative : styles.dotShort)}/>:null}
                {transport === 'WALKING'
                    ? <DirectionsWalkOutlined fontSize={'default'} className={styles.tripTimeIcon}/>
                    : <DirectionsBikeOutlined fontSize={'default'} className={styles.tripTimeIcon}/>
                }
                <div className={styles.tripText} />
                <div className={styles.tripInfo}>
                    <div className={styles.tripDuration}>{fancyTimeFormat(duration)}</div>
                    <div className={styles.tripDistance}>{fancyDistanceFormat(distance)}</div>
                </div>
                {transport === 'WALKING' ? <div className={classNames(styles.dotBottom, alternative ? styles.dotAlternative : styles.dotShort)}/>: null}
            </div>
        </div>
    )
};

TripTime.propTypes = {
    path: PropTypes.any,
    alternative: PropTypes.bool
};

TripTime.defaultProps={
    alternative:false
}
export default TripTime;

