import React, {useContext, useEffect, useRef, useState} from 'react';
import classes from "../card-component/card.module.css";
import RegionContext from "../region-context";
import WeatherService from '../../components/weather-service.js';
import {logos} from "../weather-component/wether-storage";

const Card = ({city, openModalMethod}) => {
    const {region, setRegion} = useContext(RegionContext);
    let subscription = useRef(null);

    let [relToZero, setRelToZero] = useState("");
    let [temperature, setTemperature] = useState('');
    let [description, setDescription] = useState('');
    let [img, setImg] = useState('');


    useEffect(
        () => {
            const weatherService = new WeatherService(600000);
            if(city){
                subscription.current = weatherService.getSubscriber(city).subscribe(
                (res) => {
                    // console.log(res, city)
                    if (res && res.data) {
                        // setLoading(false);
                        setTemperature(Math.round(res.data.main.temp));
                        setDescription(res.data.weather[0].description);
                        if(Math.round(res.data.main.temp) > 0){
                            setRelToZero('+')
                            console.log("+")
                        }
                        getImg(res.data.weather[0].description);


                    } else if(res) {
                        // setLoading(false);
                        // setErrorText(res.message)
                    }
                }
            );}
            return () => {
                if (subscription.current) {
                    subscription.current.unsubscribe();
                    console.log('unsubscribe',city)
                }
            }
        }, []
    );


    const cityTimezones = require('city-timezones');
    let timeZone = '';
    if(cityTimezones.lookupViaCity(city)[0]){
        timeZone = cityTimezones.lookupViaCity(city)[0].timezone;
    }
    let setCity = (city) => {
        setRegion({regionName : city, timeZone: timeZone});
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

    return (
            <div className={classes.card} onClick={() => setCity(city)}>
                <button className={classes.delete} onClick={(e) => {
                    openModalMethod(city);
                    e.stopPropagation()
                }}>x</button>
                <div className={classes.name}>{city}</div>
                <div className={classes.info}>
                    {temperature &&<div className={classes.icon} style={{ backgroundImage: `url(${img})` }}></div>}
                    {temperature &&<div className={classes.degree}>{relToZero}{temperature}°</div>}
                    {!temperature &&<div className={classes.icon}></div>}
                </div>

            </div>
    );
};

export default Card;
