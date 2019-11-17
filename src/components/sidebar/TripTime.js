import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {DirectionsBikeOutlined, DirectionsWalkOutlined} from '@material-ui/icons';
import styles from './Sidebar.module.css';
import fancyTimeFormat from './fancyTimeFormat';
import fancyDistanceFormat from './fancyDistanceFormat';

const TripTime = ({path, alternative, from, to}) => {
    const {transport, duration, distance} = path;
    return (
        <div className={styles.tripContainer}>
            <div className={classNames(styles.tripTimeContainer, transport === 'WALKING'? styles.tripWalking : styles.tripBike, alternative ? styles.alternative : styles.short)}>
                {transport === 'WALKING' ? <div className={classNames(styles.dotTop, alternative ? styles.dotAlternative : styles.dotShort)}/>:null}
                <div className={styles.trimTimeIconContainer}>
                    {transport === 'WALKING'
                        ? <DirectionsWalkOutlined fontSize={'default'} className={styles.tripTimeIcon}/>
                        : <DirectionsBikeOutlined fontSize={'default'} className={styles.tripTimeIcon}/>
                    }
                </div>
                <div className={styles.tripText}>
                    <span>{`${transport === 'WALKING' ? 'Walk' : 'Bike'} from `}</span>
                    <span className={styles.tripTextStep}>{from}</span>
                    <span>{' to '}</span>
                    <span className={styles.tripTextStep}>{to}</span>
                </div>
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
    alternative: PropTypes.bool,
    from: PropTypes.string,
    to: PropTypes.string,
};

TripTime.defaultProps = {
    alternative: false
};

export default TripTime;

