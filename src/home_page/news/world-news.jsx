import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import classes from './world-news.module.css';
import NewsService from '../../services/news-service.js';
import { useSelector } from 'react-redux';

function WorldNews() {
    let [wNews, setWNews] = useState([]);
    let subscription = useRef(null);
    const newsService = NewsService.getInstance();
    let [regLimit, setRegLimit] = useState(0);
    let [shown, setShown] = useState(true);
    let [loading, setLoading] = useState(true);
    const mode = useSelector(state => state.mode.mode)


    useEffect(() => {
        if(window.matchMedia("(max-width: 1024px)").matches){
            if(wNews){
                setRegLimit(1);
            }
        } else {
            setRegLimit(4);
        }
    });
    useEffect(
        () => {
            let myInterval = setInterval(() => {
                setWNews(prevValue => {
                    if (prevValue.length > 4) {
                        let tempArr = prevValue;
                        const first = tempArr.shift();
                        return [...tempArr, first];
                    } else {
                        return prevValue;
                    }
                });

                }, 30000
            );
            subscription.current = newsService.getSubscriber().subscribe(
                (res) => {
                    if (res && res.data) {
                        setWNews(res.data['articles']);
                        setLoading(false);
                    } else if(res && res.message) {
                        console.error('error', res);
                        setLoading(false);

                    }
                }
            );
            return () => {
                if (subscription.current) {
                    subscription.current.unsubscribe();
                }
                clearInterval(myInterval);
            }
        }, []
    );
    let makeWNews = useCallback(() => {
        return wNews.map((item,index) => (
            <a key={index} className={(index === 0)? [classes.wNew, classes.fadeOut].join(' ') : (index === 3)? [classes.wNew, classes.fadeIn].join(' ') : [classes.wNew]}  href={item['url']} target="_blank">{item['title']}</a>
        )).slice(0,regLimit);

    }, [wNews]);
    return (
        <div className={shown? classes.wrapper : classes.wrapperskippedWidth}>
            <div className={classes.head}>
                <div className={classes.title}>
                    <div className={classes.thunder}></div>
                    <div className={classes.wnews}>World news</div>
                </div>
               {shown &&<button className={mode==='night'? classes.skipBtnNight: classes.skipBtn} onClick={()=>setShown(!shown)}>hide</button>}
               {!shown &&<button className={mode==='night'? classes.skipBtnNight: classes.skipBtn} onClick={()=>setShown(!shown)}>show</button>}
            </div>
            {loading && <div className={classes.spinner}>
                <div/>
                <div/>
                <div/>
                <div/>
            </div>}
            {shown && !!wNews.length&&<div className={classes.context}>
                {makeWNews()}
            </div>}
            {!wNews.length && !loading && shown &&<div className={classes.noContext}>Oops..Please, try again latter</div>}
        </div>
    );
}

export default WorldNews;
