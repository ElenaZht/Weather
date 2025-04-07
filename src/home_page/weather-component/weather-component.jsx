import React, {useContext, useEffect, useRef, useState} from 'react';
import classes from './weather-component.module.css';
import WeatherService from '../../services/weather-service.js';
import {pictures, advices} from '../../storages/wether-storage.js';
import { useSelector, useDispatch } from 'react-redux';
import { setMode } from '../../redux/modeSlice.js';

const WeatherComponent = () => {
    const mode = useSelector(state => state.mode.mode)
    const dispatch = useDispatch()
    const currentRegion = useSelector(state => state.region.currentRegion)

    let [loading, setLoading] = useState(true);
    const weatherService = WeatherService.getInstance();
    let subscription = useRef(null);
    let [weather, setWeather] = useState(null);
    let [relToZero, setRelToZero] = useState("");
    let [temperature, setTemperature] = useState('');
    let [description, setDescription] = useState('');
    let [sunrise, setSunrise] = useState('');
    let [sunset, setSunset] = useState('');
    let [wind, setWind] = useState('');
    let [img, setImg] = useState('../../assets/weather-logo/clear.png');
    let [advice, setAdvice] = useState('');
    let [hum, setHum] = useState('');
    let [errorText, setErrorText] = useState('');
    let getAdvice = (desc, temp, wind) => {
        if(desc.match(/thunderstorm/i)){
            setAdvice(advices.thunderstorm)
        } else if(desc.match(/rain/i)){
            setAdvice(advices.raining_weather)
        } else if(desc.match(/snow/i)){
            setAdvice(advices.snowing)
        } else if(desc.match(/mist/i)){
            setAdvice(advices.mist)
        } else if(wind >= 10){
            setAdvice(advices.strong_wind)
        } else if(temp < 15){
            setAdvice(advices.cold_weather)
        } else if(temp > 25 && temp < 32){
            setAdvice(advices.hot_weather)
        } else if(temp > 32){
            setAdvice(advices.extremely_hot_weather)
        } else {
            setAdvice(advices.nice_weather)
        }

    };
    let getImg = (currentRegion,desc, mode) => {
        if(desc.match(/clear/i)){
            if(mode==='night'){
                setImg(()=> {return pictures["clear sky night"]})
            } else {
                setImg(()=>{return pictures["clear sky"]})
            }
        } else if(desc.match(/few clouds/i)){
            if(mode==='night'){
                setImg(()=>{return pictures["few clouds night"]})
            } else {
                setImg(()=>{return pictures["few clouds"]})
            }
        } else if(desc.match(/clouds/i)){
            setImg(()=>{return pictures.clouds})
        } else if(desc.match(/thunderstorm/i)){
            setImg(()=>{return pictures.thunderstorm})
        } else if(desc.match(/rain/i)){
            setImg(()=>{return pictures.rain})
        } else if(desc.match(/snow/i)){
            setImg(()=>{return pictures.snow})
        } else if(desc.match(/mist/i) || desc.match(/fog/i)){
            setImg(()=>{return pictures.mist})
        }
    };


    function parseWeather(data){
        if(data){
            if(data.main){
                setTemperature(Math.round(data.main.temp));
                setDescription(data.weather[0].description);
                if(currentRegion.timeZone.length){
                    setSunrise(new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {timeZone: currentRegion.timeZone, hour: '2-digit', minute:'2-digit'}));
                    setSunset(new Date(data.sys.sunset * 1000).toLocaleTimeString([], {timeZone: currentRegion.timeZone, hour: '2-digit', minute:'2-digit'}));
                } else {
                    setSunrise('');
                    setSunset('')
                }
                setWind(Number(data.wind.speed.toFixed(1)));
                getImg(currentRegion, data.weather[0].description, mode);
                getAdvice(data.weather[0].description, Math.round(data.main.temp), data.wind.speed.toFixed(1));
                setHum(data.main.humidity);
                if(data.main.temp > 0){
                    setRelToZero('+')
                }
            }

        }
    }

    useEffect(() => {
        setLoading(true);
        if (subscription.current){
            weatherService.setCity(currentRegion.regionName)
        }

    }, [currentRegion]);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(
        () => {
            subscription.current = weatherService.getSubscriber(currentRegion.regionName).subscribe(
                (res) => {
                    if (res && res.data) {
                        setLoading(false);
                        setWeather(res.data);
                        parseWeather(res.data);
                        setErrorText('');
                        if(currentRegion.timeZone.length){
                            dayOrNight(res.data.sys.sunrise, res.data.sys.sunset)
                        } else {
                            dispatch(setMode('day'))
                        }
                    } else if(res && res.message) {
                        setLoading(false);
                        setErrorText(res.message);
                        console.error('error', res)
                    }
                }
            );
            return () => {
                if (subscription.current) {
                    subscription.current.unsubscribe();
                }
            }
        }, [currentRegion, mode]
    );
    const dayOrNight = (sunriseCode, sunsetCode) => {
        let rise = Date.parse(new Date(sunriseCode * 1000).toLocaleString('en-US', {timeZone: currentRegion.timeZone}));
        let set = Date.parse(new Date(sunsetCode * 1000).toLocaleString('en-US', {timeZone: currentRegion.timeZone}));
        let current = Date.parse(new Date().toLocaleString('en-US', {timeZone: currentRegion.timeZone}));
        if(rise < current && current < set){
            dispatch(setMode('day'))
        } else {
            dispatch(setMode('night'))
        }
    };
    return (
        <div className={mode==='night'? classes.wrapperNight : classes.wrapper}>

            {loading && <div className={classes.spinner}>
                <div/>
                <div/>
                <div/>
                <div/>
            </div>}

            {!!((!weather || !weather.main || errorText.length)&& !loading) &&
            <div className={classes.noResponse}>
                <span className={classes.noResponseTitle}>Sorry! Weather is not provided</span>
                <span className={classes.noResponseText}>Please, try again later.</span>
            </div>}
            {!!(weather &&  weather.main && !loading && !errorText.length) &&
            <div className={classes.leftSide}>
                <div className={classes.degree}>
                    {temperature && <div data-testid="digit" className={classes.digit}>
                        <p>{relToZero}</p>
                        {temperature}°
                    </div>}
                    {description.length && <div className={classes.text}>{description}</div>}
                </div>
                {advice.length && <div className={classes.advice}>{advice}</div>}
            </div>}
            {!!(weather && weather.main && !loading && !errorText.length) && <div className={classes.rightSide}>
                <div className={classes.picture} style={{ backgroundImage: `url(${img})` }}></div>
                {!!(weather && weather.main) && <div className={classes.details}>
                    <div className={classes.sunrise}>
                        <div className={classes.sunriseIcon}></div>
                        <div>{sunrise}</div>
                    </div>
                    <div className={classes.sunset}>
                        <div className={classes.sunsetIcon}></div>
                        <div>{sunset}</div>
                    </div>
                    {!!(weather && weather.main) && <div className={classes.wind}>
                        <div className={classes.windIcon}></div>
                        <div>{wind} m/s</div>
                    </div>}
                    {!!(weather && weather.main) && <div className={classes.hum}>
                        <div className={classes.humIcon}></div>
                        <div>{hum} %</div>
                    </div>}
                </div>}
            </div>}
        </div>
    );
};

export default WeatherComponent;
