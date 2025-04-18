import React, {useEffect, useRef, useState} from 'react';
import classes from "./card.module.css";
import {logos} from "../../storages/wether-storage.js";
import { useSelector, useDispatch } from 'react-redux';
import { setSearchIsOpen } from '../../search_page/search-component/searchSlice.js';
import { setCurrentRegion } from '../../home_page/region-area/regionSlice.js';
import {fetchWeatherForCityCard} from  '../../home_page/weather-component/weatherSlice.js'

const Card = ({city, openModalMethod, status}) => {
    let [relToZero, setRelToZero] = useState("");
    let [temperature, setTemperature] = useState('');
    let [description, setDescription] = useState('');
    let [img, setImg] = useState('');
    const mode = useSelector(state => state.mode.mode)
    const dispatch = useDispatch()
    const currentRegion = useSelector(state => state.region.currentRegion)
    const errorText = useSelector(state => state.weather.error)


    useEffect(() => {
        if (city) {
            dispatch(fetchWeatherForCityCard(city))
                .unwrap() // Extract the resolved value from the thunk
                .then((data) => {
                    setTemperature(Math.round(data.main.temp)); // Set temperature
                    setDescription(data.weather[0].description); // Set description
                    getImg(data.weather[0].description); // Set the appropriate image
                    if (Math.round(data.main.temp) > 0) {
                        setRelToZero('+'); // Add "+" for positive temperatures
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch weather:', error); // Handle errors
                });
        }
    }, [city, dispatch]);


    const cityTimezones = require('city-timezones');
    let timeZone = '';
    let country = '';
    if(cityTimezones.lookupViaCity(city)[0]){
        timeZone = cityTimezones.lookupViaCity(city)[0].timezone;
        country = cityTimezones.lookupViaCity(city)[0].iso2;
    }
    let setCity = (city) => {
        dispatch(setCurrentRegion({regionName : city, timeZone: timeZone, country: country}))
        dispatch(setSearchIsOpen(false))
    };

    let getImg = (desc) => {
        if(desc.match(/clear/i)){
            setImg(logos["clear_sky"])
        } else if(desc.match(/few clouds/i)){
            setImg(logos["few clouds"])
        } else if(desc.match(/scattered/i)){
            setImg(logos.scattered)

        } else if(desc.match(/clouds/i)){
            setImg(logos.clouds)

        } else if(desc.match(/thunderstorm/i)){
            setImg(logos.thunderstorm)

        } else if(desc.match(/rain/i)){
            setImg(logos.rain)

        } else if(desc.match(/snow/i)){
            setImg(logos.snow)

        } else if(desc.match(/mist/i)){
            setImg(logos.mist)

        }
    };
    let openModal = (e) => {
        openModalMethod(city);
        e.stopPropagation()
    };

    return (
            <div className={mode ==='night'? 'cardNight' : 'card'} onClick={() => setCity(city)}>
                {status>0 &&<button className={classes.delete} onClick={(e) => {openModal(e)}}>x</button>}
                <div className={classes.name}>{city}</div>
                {!temperature &&<div className={classes.error}>weather not provided</div>}
                <div className={classes.info}>
                    {temperature &&<div className={mode=='night'? classes.iconNight : classes.icon} style={{ backgroundImage: `url(${img})` }}></div>}
                    {temperature &&<div className={mode==='night'? classes.degreeNight : classes.degree}>{relToZero}{temperature}°</div>}
                    {!temperature &&<div className={mode=='night'? classes.iconNight : classes.icon}></div>}
                </div>

            </div>
    );
};

export default Card;
