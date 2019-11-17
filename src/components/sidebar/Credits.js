import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {ArrowBack} from '@material-ui/icons';
import styles from './Sidebar.module.css';

const Credits = ({ onBack, className }) => (
  <nav className={classNames('Sidebar', className, styles.container)}>
      <div className={styles.creditsContainer}>
        <div className={styles.creditsBackContainer}>
          <ArrowBack
            className={styles.creditsBack}
            style={{fontSize: 24}}
            onClick={onBack}
          />
        </div>
        <div className={styles.creditsTitle}>Credits</div>
        <div className={styles.creditsItem}>Logo icon made by Freepick from <a href={'https://www.flaticon.com'}>FlatIcon</a>.</div>
        <div className={styles.creditsItem}>Other icons provided by <a href={'https://material-ui.com'}>Material-UI</a> and <a href={'https://fontawesome.com/'}>FontAwesome</a>.</div>
        <div className={styles.creditsItem}>Maps and directions provided by <a href={'https://google.com'}>Google</a>.</div>
        <div className={styles.creditsItem}>Bike usage data provided by <a href={'https://www.publibike.ch'}>PubliBike</a>.</div>
        <div className={styles.creditsItem}>Application developed by <b>Andrea Aquino</b>, <b>Virginie Blancs</b>, <b>Nicola Damian</b>, <b>Giuseppe Mendola</b>, <b>Gabriele Prestifilippo</b> and <b>Amedeo Zucchetti</b>.</div>
      </div>
  </nav>
);

Credits.propTypes = {
    className: PropTypes.string,
    onBack: PropTypes.func,
};

export default Credits;
