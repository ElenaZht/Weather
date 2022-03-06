import axios from 'axios';
import {BehaviorSubject} from 'rxjs';

let interval = 600000;

class WeatherService{
    _instance;
    city = '';
    subscriber = new BehaviorSubject(null);


    constructor(customInterval) {
        setInterval(async()=> {
            let data = await this.getWeatherFromAPI(this.city);
            console.log('interval:', data);
            this.subscriber.next(data)
        }, customInterval)
    }

    getSubscriber(city){
        this.city = city;
        (async () => {

                setTimeout(async()=>{
                    try{
                    let data = await this.getWeatherFromAPI(this.city);
                    this.subscriber.next(data);
                    console.log('данные отправлены')
                    } catch (e) {
                        console.log(e.message);
                        this.subscriber.next(e);

                    }
                }, 5000)


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
        const pref = 'https://api.openweathermap.org/data/2.5/weather?q=';
        // const pref = 'https://api.openweathermap.org/data/2.5/weatherA?q='; //wrong url
        const postf = '&units=metric&appid=';
        const key = 'eb8340c39e25e9a743e2f50e800f1bb3';
        return axios.get(pref + city.toLowerCase() + postf + key);
    }

}
export default WeatherService
