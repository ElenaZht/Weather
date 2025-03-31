import React from 'react';
import axios from "axios";
import {BehaviorSubject} from "rxjs";


class NewsService{
    // Your API key is: 80b4557be1dd40f8b91006bf5fccdf89
    subscriber = new BehaviorSubject(null);
    subscriber2 = new BehaviorSubject(null);
    _instance;
    country = '';
    constructor(){
        setInterval(async()=> {
            let data = await this.getWNews();
            let dataL = await this.getLNews(this.country);
            this.subscriber.next(data);
            this.subscriber2.next(dataL);
        }, 900000) //*15min
    };

    getSubscriber(){
        (async () => {
            try{
                let data = await this.getWNews();
                this.subscriber.next(data);
            } catch (e) {
                this.subscriber.next(e);
            }

        })();
        return this.subscriber.asObservable();
    }
    getSubscriber2(region){
        (async () => {
            try{
                let data = await this.getLNews(region['country']);
                this.subscriber2.next(data);
            } catch (e) {
                this.subscriber2.next(e);
            }

        })();
        return this.subscriber2.asObservable();
    }
    setCountry(country){
        this.country = country;
        (async () => {
            let data = await this.getLNews(this.country);
            this.subscriber2.next(data);
        })();
    }
    getWNews = async () => {
        // https://newsapi.org//v2/top-headlines?sources=bbc-news&apiKey=
        const key = '80b4557be1dd40f8b91006bf5fccdf89';
        // return await axios.get(window.location.protocol + '//api.themove.fun/news/top-headlines?sources=bbc-news&apiKey=' + key) < --- proxy
        return await axios.get('https://newsapi.org//v2/top-headlines?sources=bbc-news&apiKey=' + key) // < --- localhost

    };
    getLNews = async (country) => {
            const key = '80b4557be1dd40f8b91006bf5fccdf89';
            const pref = window.location.protocol + '//api.themove.fun/news/top-headlines?country=';
            if(country.length){
                // return await axios.get(pref + country.toLowerCase() + '&apiKey=' + key) < --- proxy
                return await axios.get('https://newsapi.org//v2/top-headlines?country=' + country.toLowerCase() + '&apiKey=' + key) // < --- localhost
            } else return {}



    };
    static getInstance(){
        if(!NewsService._instance){
            NewsService._instance = new NewsService();
        }
        return NewsService._instance;
    }
}

export default NewsService;
