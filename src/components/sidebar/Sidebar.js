import React, {useState} from 'react';
import styles from './Sidebar.module.css';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import TripTime from './TripTime';
import {FlagOutlined, RoomOutlined} from '@material-ui/icons';
import {runShortestPathAlg} from '../../utils/addGoogleSearchBox';
import geoCoder from '../../utils/geoCoder';
import hotStationLogo from '../../assets/station_marker_hot.svg';


const Sidebar = ({ className, fromRef, toRef, mapHandler }) => {
    const [paths, setPaths] = useState(null);

  const shortestPath = paths ? paths.shortest : null;

  return (
    <nav className={classNames('Sidebar', className, styles.container)}>
      <header className={styles.header}>
        <div className={styles.title}>
          <img src={`${process.env.PUBLIC_URL}/biker.svg`} width={42} />
          <span className={styles.titleBike}>Bike</span>
          <span className={styles.titleMe}>Me</span>
          <span className={styles.titleThere}>There</span>
        </div>
        <div>
          <div className={styles.inputContainer}>
            <div className={styles.iconContainer}>
              <i
                className={classNames('fas fa-map-marker-alt', styles.icon)}
                onClick={()=>geoCoder(mapHandler,fromRef,'start')}
              />
            </div>
            <input
              ref={fromRef}
              id='from-place'
              placeholder='Choose starting point...'
              className={styles.input}
            />
          </div>
          <div className={classNames(styles.inputContainer, styles.secondInput)}>
            <div className={styles.iconContainer}>
              <i
                className={classNames('far fa-flag', styles.icon)}
                onClick={() => geoCoder(mapHandler,toRef, 'dest')}
              />
            </div>
            <input
              ref={toRef}
              id='to-place'
              placeholder='Choose destination...'
              className={styles.input}
            />
          </div>
        </div>
        <button
          className={styles.button}
          onClick={() => {
            runShortestPathAlg(mapHandler.map, mapHandler.maps, setPaths);
          }}
        >
          Search
        </button>
      </header>

      <div className={styles.content}>
          <div className={styles.overallTripContainer}>
              {shortestPath && shortestPath.map(path => <TripTime path={path}/>)}
          </div>
      </div>
    <footer className={styles.footer}>
        <div>
            <img src={hotStationLogo} width={30} />
        </div>
        <div className={styles.legend}>
            <span > Stations with this symbol are usually on high demand at this time. Travel there to help your fellow bikers and earn some rewards.</span>
        </div>
    </footer>
    </nav>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  fromRef: PropTypes.any,
  toRef: PropTypes.any,
  paths: PropTypes.any,
  mapHandler: PropTypes.any,
};

export default Sidebar;
