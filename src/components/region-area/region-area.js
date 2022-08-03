import React, {useContext, useEffect, useState} from 'react';
import classes from './region-area.module.css'
import MyButton from '../MyButton';
import WeatherComponent from '../../components/weather-component/weather-component.js';
import RegionContext from '../../components/region-context';
import ColorThemeContex from '../../components/color-theme-context.js';
import WorldNews from "../news/world-news";
import LocalNews from "../news/local-news";

const RegionArea = () => {

    const{region, setRegion} = useContext(RegionContext);
    const {theme, setTheme} = useContext(ColorThemeContex);

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
        }, []
    );

    useEffect(() => {
        checkRegionsDate();
        let myInterval = setInterval(async()=>{
            checkRegionsDate();
            // console.log('i use region', region)
        }, 5000);
        return () => {
            clearInterval(myInterval)
        }
    }, [region]);// eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className={classes.regionContainer}>
            <div className={classes.wrap}>
                {region.regionName? (
                    <div className={classes.region}>
                        <div className={theme==='night'? classes.regionInfoNight : classes.regionInfo}>
                            <span className={classes.regionName}>{region.regionName}</span>
                            <span className={classes.regionTimeDate}>{date}</span>
                        </div>
                        <div className={classes.innerWrapper}>
                            <WeatherComponent/>
                            <WorldNews/>
                            <LocalNews/>
                        </div>

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
