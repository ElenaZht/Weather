import React from 'react';
import classes from './region-area.module.css'
import MyButton from '../MyButton';
const RegionArea = ({region}) => {
    return (
        <div className={classes.regionContainer}>
            <div className={classes.wrap}>
                {region.regionName? (
                    <div className={classes.regionInfo}>
                    <span className={classes.regionName}>{region.regionName}</span>
                    <span className={classes.regionTimeDate}>{region.date}</span>
                    </div>
                ) : (
                    <div className={classes.noRegion}>
                        <span>Please, choose region!</span>
                        <MyButton/>
                    </div>
                )}

            </div>


        </div>
    );
};

export default RegionArea;
