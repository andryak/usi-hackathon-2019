// path: route[]
// route: {
//   duration:
//   distance:
//   overviewPath:
//   transport:
import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';


const TripTime=({path})=>{
    console.log('xxx path', path);
    return (
        <div>
            {/*<span>{transport}</span>*/}
            {/*{duration}*/}
        </div>
    )
};

TripTime.propTypes = {
    path: PropTypes.any,
    transport: PropTypes.any,
    duration: PropTypes.any,

};

export default TripTime;

