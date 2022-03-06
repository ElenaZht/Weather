import React, {useEffect, useRef, useState} from 'react';
import classes from  './weather-component.module.css'
import WeatherService from '../../components/weather-service.js'
import {pictures, advices} from './wether-storage.js'

const WeatherComponent = ({region}) => {
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
        // console.log(desc, temp, wind);
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
    let getImg = (desc) => {
        if(desc.match(/clear/i)){
            setImg(pictures["clear sky"])
        } else if(desc.match(/few clouds/i)){
            setImg(pictures["few clouds"])
        } else if(desc.match(/clouds/i)){
            setImg(pictures.clouds)
        } else if(desc.match(/thunderstorm/i)){
            setImg(pictures.thunderstorm)
        } else if(desc.match(/rain/i)){
            setImg(pictures.rain)
        } else if(desc.match(/snow/i)){
            setImg(pictures.snow)
        } else if(desc.match(/mist/i)){
            setImg(pictures.mist)
        }
    };


    useEffect(() => {
            if(weather){
                if(weather.main){
                    setTemperature(Math.round(weather.main.temp));
                    setDescription(weather.weather[0].description);
                    setSunrise(new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
                    setSunset(new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
                    setWind(Number(weather.wind.speed.toFixed(1)));
                    getImg(weather.weather[0].description);
                    getAdvice(weather.weather[0].description, Math.round(weather.main.temp), weather.wind.speed.toFixed(1));
                    setHum(weather.main.humidity);
                    if(weather.main.temp > 0){
                        setRelToZero('+')
                    }
                }

            }

        }
        ,[weather]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        subscription.current = weatherService.getSubscriber(region.regionName).subscribe(
            (res) => {
                console.log(res)
                if (res && res.data) {
                    setLoading(false);
                    setWeather(res.data);
                } else if(res) {
                    setLoading(false);
                    setErrorText(res.message)
                }
            }
        );
        return () => {
            if (subscription.current) {
                subscription.current.unsubscribe()
            }
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    // useEffect(() => {
    //     if (loading) {
    //         setTimeout(() => {
    //             setLoading(false);
    //             console.log('out of time')
    //         }, 10000);
    //     }
    // }, [loading]);
    return (
        <div className={classes.wrapper}>

            {loading && <div className={classes.spinner}>
                <div/>
                <div/>
                <div/>
                <div/>
            </div>}

            {!!((!weather || !weather.main)&& !loading) &&
            <div className={classes.noResponse}>
                <span className={classes.noResponseTitle}>Sorry! {errorText}</span>
                <span className={classes.noResponseText}>Please, try again later.</span>
            </div>}
            {!!(weather &&  weather.main) &&
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
            {!!(weather && weather.main) && <div className={classes.rightSide}>
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
