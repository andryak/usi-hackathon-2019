import React, {useState} from 'react';
import styles from './Sidebar.module.css';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import TripTime from './TripTime';
import {MyLocation} from '@material-ui/icons';
import {runShortestPathAlg} from '../../utils/addGoogleSearchBox';
import geoCoder from '../../utils/geoCoder';
import hotStationLogo from '../../assets/station_marker_hot.svg';
import TabBar from './tab-bar';
import directionPositions from '../../utils/directionPositions';

const getPlaces = paths => {
  const places = [];
  places.push(directionPositions.getPlaces().startPlace);
  paths.forEach(path => {
    if (path.stations) {
      places.push(`${path.stations.from.name} station`);
      places.push(`${path.stations.end.name} station`);
    }
  });
  places.push(directionPositions.getPlaces().destPlace);
  return places;
};

const Sidebar = ({ className, fromRef, toRef, mapHandler }) => {
  const [paths, setPaths] = useState(null);

  const shortestPath = paths ? paths.shortest : null;
  const alternativePath = paths ? paths.alternative: null;

  const tabs = [];
  if (shortestPath) {
    const places = getPlaces(shortestPath);
    tabs.push({
      label: 'Shortest',
      component: (
        <div className={styles.overallTripContainer}>
          {shortestPath.map((path, i) => (
            <TripTime alternative={false} path={path} key={i} from={places[i]} to={places[i + 1]}/>
          ))}
        </div>
      ),
    })
  }
  if (alternativePath) {
    const places = getPlaces(alternativePath);
    tabs.push({
      label: 'Eco',
      component: (
        <div className={styles.overallTripContainer}>
          {alternativePath.map((path, i) => (
            <TripTime alternative={true} path={path} key={i} from={places[i]} to={places[i + 1]} />
          ))}
        </div>
      ),
    })
  }

  return (
    <nav className={classNames('Sidebar', className, styles.container)}>
      <header className={styles.header}>
        <div className={styles.title}>
          <img src={`${process.env.PUBLIC_URL}/biker.svg`} width={42} alt={'logo'} />
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
              <i className={classNames('fas fa-flag', styles.icon)} />
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
          onClick={() => runShortestPathAlg(mapHandler.map, mapHandler.maps, setPaths)}
        >
          Search
        </button>
      </header>

      <div className={styles.content}>
        {Boolean(tabs.length) && (
          <TabBar
            className={styles.tabBar}
            current={0}
            tabs={tabs}
          />
        )}
      </div>
      <footer className={styles.footer}>
          <div>
            <img src={hotStationLogo} width={26} alt={'marker'} />
          </div>
          <div className={styles.legend}>
            <span>Stations with this symbol are usually on high demand at this time. Travel there to help your fellow bikers and earn awesome rewards!</span>
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
