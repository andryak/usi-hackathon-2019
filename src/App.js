import React from 'react';
import Sidebar from './components/sidebar';
import styles from './App.module.css';
import classNames from 'classnames';
import SimpleMap from './SimpleMap';

const App = () => {
  return (
    <div className={classNames('App', styles.container)}>
      <Sidebar className={styles.sidebar} />
      <main className={styles.mainPanel}>
        <SimpleMap/>
      </main>
    </div>
  );
}

export default App;
