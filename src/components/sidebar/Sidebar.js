import React from 'react';
import styles from './Sidebar.module.css';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Sidebar = ({ className }) => {
  return (
    <nav className={classNames('Sidebar', className)}>
      <header className={styles.header}>
        <input
          id='from-place'
          placeholder='Choose starting point...'
          className={styles.input}
        />
        <input
          id='to-place'
          placeholder='Choose destination...'
          className={classNames(styles.input, styles.secondInput)}
        />
      </header>
    </nav>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
