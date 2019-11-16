import React from 'react';
import styles from './Sidebar.module.css';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import TripTime from './TripTime';
import {FlagOutlined, RoomOutlined} from '@material-ui/icons';
import {runShortestPathAlg} from '../../utils/addGoogleSearchBox';
import geoCoder from '../../utils/geoCoder';


const Sidebar = ({ className, fromRef, toRef, paths, mapHandler }) => {
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
                className={classNames('fas fa-flag', styles.icon)}
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
            runShortestPathAlg(mapHandler.map, mapHandler.maps);
          }}
        >
          Search
        </button>
      </header>
      <div className={styles.content}/>
      <div>
        {shortestPath && shortestPath.map(path => <TripTime path={path}/>)}
      </div>
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
