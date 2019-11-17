import React, {useState} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './TabBar.module.css';


const TabBar = ({className, tabs, current}) => {
    const [activeTabIndex, setActiveTabIndex] = useState(current);

    if (tabs.length < 1) {
        throw new Error('Cannot create a TabBar with no tabs');
    }

    const labels = tabs.map(({label}, index) => (
        <div
            key={index}
            className={classNames(styles.label, {[styles.active]: index === activeTabIndex})}
            onClick={() => setActiveTabIndex(index)}
        >
            {label}
        </div>
    ));

    return (
        <div className={classNames('Tabs', styles.container, className)}>
            <div className={styles.header}>{labels}</div>
            <div>{tabs[activeTabIndex].component}</div>
        </div>
    );
};

TabBar.propTypes = {
    className: PropTypes.string,
    theme: PropTypes.oneOf(['empty', 'full']),
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            component: PropTypes.any,
        })
    ).isRequired,
    /**
     * The index of the currently opened tab.
     */
    current: PropTypes.number,
};

TabBar.defaultProps = {
    className: '',
    current: 0,
};

export default TabBar;
