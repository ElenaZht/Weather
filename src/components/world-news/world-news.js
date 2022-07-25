import React, {useEffect, useRef, useState} from 'react';
import classes from './world-news.module.css';
import NewsService from '../../components/news-service.js';

function WorldNews(props) {
    let [wNews, setWNews] = useState([]);
    let subscription = useRef(null);
    const newsService = NewsService.getInstance();



    useEffect(
        () => {
            subscription.current = newsService.getSubscriber().subscribe(
                (res) => {
                    if (res && res.data) {
                        // console.log(res)

                    } else if(res && res.message) {
                        console.log('error', res)
                    }
                }
            );
            return () => {
                if (subscription.current) {
                    subscription.current.unsubscribe();
                }
            }
        }, []
    );
    return (
        <div></div>
    );
}

export default WorldNews;
