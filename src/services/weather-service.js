import axios from 'axios';
import {BehaviorSubject} from 'rxjs';

let interval = 600000;

class WeatherService{
    _instance;
    city = '';
    // cities = [];
    subscriber = new BehaviorSubject(null);


    constructor(customInterval) {
        setInterval(async()=> {
            // for
            let data = await this.getWeatherFromAPI(this.city);
            this.subscriber.next(data);
        }, customInterval)
    }

    setCity(city){
        this.city = city;
        (async () => {
            let data = await this.getWeatherFromAPI(this.city);
            this.subscriber.next(data);
        })();
    }

    getSubscriber(city){
        this.city = city;
        (async () => {
                    try{
                    let data = await this.getWeatherFromAPI(this.city);
                    this.subscriber.next(data);
                    } catch (e) {
                        this.subscriber.next(e);
                    }

        })();
        return this.subscriber.asObservable();
    }
    static getInstance(customInterval=interval){
        if(!WeatherService._instance){
            WeatherService._instance = new WeatherService(customInterval);
        }
        return WeatherService._instance;
    }
    async getWeatherFromAPI(city){
        const pref = window.location.protocol + '//api.themove.fun/weather?q=';
        // const pref = 'https://api.openweathermap.org/data/2.5/weather?q=';
        const postf = '&units=metric&appid=';
        const key = 'eb8340c39e25e9a743e2f50e800f1bb3';
        // return axios.get(pref + city.toLowerCase() + postf + key); < -- proxy
        return axios.get('https://api.openweathermap.org/data/2.5/weather?q=' + city.toLowerCase() + postf + key); // < -- localhost

    }

}
export default WeatherService
