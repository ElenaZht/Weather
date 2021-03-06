import React, {useContext, useEffect, useState} from 'react';
import classes from './region-area.module.css'
import MyButton from '../MyButton';
import WeatherComponent from '../../components/weather-component/weather-component.js';
import RegionContext from '../../components/region-context'

const RegionArea = () => {

    const{region, setRegion} = useContext(RegionContext);

    // console.log(region.timeZone)
    let [date, setDate] = useState('');
    let getCurDate = () => {
            let dateString = new Date().toLocaleString('en-US', {timeZone: region.timeZone});
            let dateObj = new Date(dateString);
            return dateObj.getHours() + ":" + (dateObj.getMinutes()<10?'0':'') + dateObj.getMinutes() + "  "+ dateObj.getDate() + " " + dateObj.toDateString().split(" ")[1] + " " + dateObj.getFullYear()
    };
    let checkRegionsDate = () => {
        if(region.timeZone.length){
            let curDate = getCurDate();
            setDate(curDate)
        } else {
            setDate('');
            // console.log('hello')

        }
    };
    useEffect(
        () => {
            checkRegionsDate();
        }, [region]
    );

    useEffect(() => {

        let myInterval = setInterval(async()=>{
            checkRegionsDate();
            // console.log('i use region', region)
        }, 5000);
        return () => {
            clearInterval(myInterval)
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className={classes.regionContainer}>
            <div className={classes.wrap}>
                {region.regionName? (
                    <div className={classes.region}>
                        <div className={classes.regionInfo}>
                            <span className={classes.regionName}>{region.regionName}</span>
                            <span className={classes.regionTimeDate}>{date}</span>
                        </div>
                        <WeatherComponent/>
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
