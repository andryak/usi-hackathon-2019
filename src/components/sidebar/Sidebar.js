import React from 'react';
import styles from './Sidebar.module.css';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import TripTime from './TripTime';
import {FlagOutlined, RoomOutlined} from '@material-ui/icons';


const Sidebar = ({ className, fromRef, toRef, paths }) => {
  const shortestPath = paths ? paths.shortest : null;

  return (
    <nav className={classNames('Sidebar', className, styles.container)}>
      <header className={styles.header}>
        <div className={styles.inputContainer}>
          <RoomOutlined className={styles.icon} />
          <input
            ref={fromRef}
            id='from-place'
            placeholder='Choose starting point...'
            className={styles.input}
          />
        </div>
        <div className={classNames(styles.inputContainer, styles.secondInput)}>
          <FlagOutlined className={styles.icon} />
        <input
          ref={toRef}
          id='to-place'
          placeholder='Choose destination...'
          className={styles.input}
        />
        </div>
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
};

export default Sidebar;
