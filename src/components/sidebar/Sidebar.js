import React, {useState} from 'react';
import styles from './Sidebar.module.css';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import TripTime from './TripTime';
import {MyLocation} from '@material-ui/icons';
import {runShortestPathAlg} from '../../utils/addGoogleSearchBox';
import geoCoder from '../../utils/geoCoder';


const Sidebar = ({ className, fromRef, toRef, mapHandler }) => {
    const [paths, setPaths] = useState(null);

  const shortestPath = paths ? paths.shortest : null;
  const alternative = paths ? paths.alternative: null;
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
              <i className={classNames('fas fa-map-marker-alt', styles.icon)}/>
            </div>
            <input
              ref={fromRef}
              id='from-place'
              placeholder='Choose starting point...'
              className={styles.input}
              style={{paddingRight: '2rem'}}
            />
            <MyLocation
              className={styles.locationIcon}
              style={{fontSize: 18}}
              onClick={()=>geoCoder(mapHandler,fromRef,'start')}
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
              className={classNames(styles.input, styles.destInput)}
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
              {shortestPath && shortestPath.map(path => <TripTime alternative={false} path={path}/>)}
          </div>
          <div className={styles.overallTripContainer}>
              {alternative && alternative.map(path => <TripTime alternative={true} path={path}/>)}
          </div>
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
