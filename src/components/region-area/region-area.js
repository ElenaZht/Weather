import React, {useEffect, useState} from 'react';
import classes from './region-area.module.css'
import MyButton from '../MyButton';
import WeatherComponent from '../../components/weather-component/weather-component.js'

const RegionArea = ({region}) => {
    let dateString = new Date().toLocaleString('en-US', {timeZone: region.timeZone});
    let dateObj = new Date(dateString);
    let [date, setDate] = useState(dateObj.getHours() + ":" + (dateObj.getMinutes()<10?'0':'') + dateObj.getMinutes() + "  "+ dateObj.getDate() + " " + dateObj.toDateString().split(" ")[1] + " " + dateObj.getFullYear());
    let getCurDate = () => {
        let dateString = new Date().toLocaleString('en-US', {timeZone: region.timeZone});
        let dateObj = new Date(dateString);
        return dateObj.getHours() + ":" + (dateObj.getMinutes()<10?'0':'') + dateObj.getMinutes() + "  "+ dateObj.getDate() + " " + dateObj.toDateString().split(" ")[1] + " " + dateObj.getFullYear()
    };

    useEffect(() => {
        let myInterval = setInterval(async()=>{
            let curDate = getCurDate();
            setDate(curDate)
        }, 30000);
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
                        <WeatherComponent region={region}/>
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
