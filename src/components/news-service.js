import React from 'react';
import axios from "axios";
import {BehaviorSubject} from "rxjs";

class NewsService{
    // Your API key is: 80b4557be1dd40f8b91006bf5fccdf89
    constructor(){
        setInterval(async()=> {
            let data = await this.getWNews();
            this.subscriber.next(data);
            console.log('data updated', data)
        }, 900000) //*15min
    };
    subscriber = new BehaviorSubject(null);
    _instance;
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
    getWNews = async () => {
        const key = '80b4557be1dd40f8b91006bf5fccdf89';
        const response = await axios.get('https://newsapi.org//v2/top-headlines?sources=bbc-news&apiKey=' + key);
        return response
    };
    static getInstance(){
        if(!NewsService._instance){
            NewsService._instance = new NewsService();
        }
        return NewsService._instance;
    }
}

export default NewsService;
